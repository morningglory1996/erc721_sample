<template>
  <div class="hello">
    <div v-if="loading">loading...</div>
    <div v-if="!loading">
      <form @submit.prevent="mint">
        <p>
          <input type="text" v-model="value">
        </p>
        <p>
          <button>MINT</button>
        </p>
      </form>
      <h3>{{ account }}</h3>
      <ul>
        <li v-for="(color, index) of colors" :key="index">
          <div>{{ color.color }}</div>
          <div class="token" :style="{ background: color.color }" style="margin: 0 auto;"></div>
          <div>{{ color.owner }}</div>
          <button v-if="account !== color.owner" @click="buyToken(index)">BUY</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import Color from "../../build/contracts/Color.json";
import ColorExchange from "../../build/contracts/ColorExchange.json";

export default {
  name: 'HelloWorld',
  data() {
    return {
      loading: true,
      account: "",
      colorContract: {},
      colorExchangeContract: {},
      totalSupply: 0,
      colors: [],
      value: '',
      to: ''
    }
  },
  methods: {
    async loadWeb3() {
     if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
      else {
        window.alert("Non-ethereum browser detected");
      }
    },
    async loadBlockchainData() {
      const web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      const networkId = await web3.eth.net.getId();

      const colorData = Color.networks[networkId];
      if(colorData) {
        this.colorContract = new web3.eth.Contract(Color.abi, colorData.address);
        this.totalSupply = await this.colorContract.methods.totalSupply().call();
        for(let i=0; i < this.totalSupply; i++) {
          let owner = await this.colorContract.methods.ownerOf(i).call();
          let color = await this.colorContract.methods.colors(i).call();
          color = {
            color,
            owner
          }
          this.colors.push(color);
        }
      } else {
        window.alert("contract not deployed detected network.")
      }

      const colorExchangeData = ColorExchange.networks[networkId];
      if(colorData) {
        this.colorExchangeContract = new web3.eth.Contract(ColorExchange.abi, colorExchangeData.address);
      } else {
        window.alert("contract not deployed detected network.")
      }
    },
    async mint() {
      try {
        this.loading = true;
        const result = await this.colorContract.methods.isApprovedForAll(this.account, this.colorExchangeContract._address).call();
        if(!result) {
          await this.colorContract.methods.setApprovalForAll(this.colorExchangeContract._address, true).send({ from: this.account })
        }
        await this.colorContract.methods.mint(this.value).send({ from: this.account })
        .on("receipt", () =>  {
          this.loading = false;
        })
      } catch(error) {
        console.log(error)
        this.loading = false;
      }
    },
    async buyToken(index) {
      try {
        this.loading = true;
        await this.colorExchangeContract.methods.buyTokens(index).send({ from: this.account })
        .on('receipt', () => {
          this.loading = false;
        })
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    }
  },
  async created() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.token {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  background-color: black;
}
</style>
