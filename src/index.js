import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3";
import axios from "axios";
import ABIETH from './abi_eth.json';
import ABIMNT from './abi_mnt.json';
import ABILSK from './abi_lsk.json';
import ABIGVT from './abi_gvt.json';
import ABIFLR from './abi_flr.json';
import ABISKL from './abi_skl.json';





//50-36gold 47 9-39grey 11-21blue 26-40bluishgreen 34-16grey 26-40greenish 37-5blue 43-18fadedblue 30-46maroon 36-12gold
async function connect(code) {
  var url = window.location.toString();
  var chain_name = document.getElementById('chain_name').value;
  console.log(chain_name);
  if (chain_name == 'current'){
    console.log('no chain selected');
    return;
  }

  var chainId = 0;
  var cid = '';
  var chain = '';
  var symbol = '';
  var name = '';
  var rpc = '';

  if (chain_name == 'mnt'){
    chainId = 5003;
    cid = '0x138b';
    chain = 'Mantle Testnet Sepolia';
    name = 'MANTLE';
    symbol = 'MNT';
    //rpc = "https://rpc.sepolia.mantle.xyz";
    rpc = "https://rpc.ankr.com/mantle_sepolia";
  }
  else if (chain_name == 'flr'){
    chainId = 114;
    cid = '0x72';
    chain = 'Flare Testnet Coston 2';
    name = 'FLARE';
    symbol = 'C2FLR';
    rpc = "https://coston2-api.flare.network/ext/C/rpc";
  }
  else if (chain_name == 'lsk'){
    chainId = 4202;
    cid = '0x106a';
    chain = 'Lisk Sepolia'
    name = 'LISK';
    symbol = 'ETH';
    rpc = "https://rpc.sepolia-api.lisk.com";
  }
  else if (chain_name == 'fhe'){
    chainId = 8008148;
    cid = '0x7a31d4';
    chain = 'Fhenix Nitrogen';
    name = 'FHENIX';
    symbol = 'FHE';
    rpc = "https://api.nitrogen.fhenix.zone";
  }
  else if (chain_name == 'gvt'){
    chainId = 13505;
    cid = '0x34c1';
    chain = 'Gravity Alpha Testnet Sepolia';
    name = 'GRAVITY';
    symbol = 'G';
    rpc = "https://rpc-sepolia.gravity.xyz";
  }
  else if (chain_name == 'eth'){
    chainId = 11155111;
    cid = '0xaa36a7';
    chain = 'Sepolia';
    name = 'SEPOLIA-ETH';
    symbol = 'ETH';
    rpc = "https://sepolia.infura.io";
  }
  else if (chain_name == 'skl'){
    chainId = 37084624;
    cid = '0x235ddd0';
    chain = 'SKALE Nebula Hub Testnet';
    name = 'SKALE-NEBULA';
    symbol = 'sFUEL';
    rpc = "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet";
  }
  else {
    console.log('unrecognized chain');
    return;
  }
  const provider = await detectEthereumProvider()
  console.log(window.ethereum);
  if (provider && provider === window.ethereum) {
    console.log("MetaMask is available!");

    console.log(window.ethereum.networkVersion);
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: cid }]
        });
        console.log("changed to ".concat(name).concat(" testnet successfully"));

      } catch (err) {
        console.log(err);
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
        console.log("please add ".concat(name).concat(" Testnet as a network"));
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chain,
                chainId: cid,
                nativeCurrency: { name: name, decimals: 18, symbol: symbol },
                rpcUrls: [rpc]
              }
            ]
          });
        }
        else {
            console.log(err);
        }
      }
    }
    await startApp(provider, chain_name);
  } else {
    console.log("Please install MetaMask!");
    alert("Please install metamask to be able to use this feature");
  }



}
window.connect = connect;

async function getActiveAccount(){
  try {
    const accounts = await window.ethereum.request({method: "eth_accounts"});
    return accounts[0] || null;
  }
  catch (err){
    console.log(err);
    return null;
  }
}


async function startApp(provider, chain) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?")
  }
  else {
    let active_acc = await getActiveAccount();
    let account = '';
    console.log(active_acc);


    if (active_acc){
      account = active_acc;
    }
    else {
      const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.")
        } else {
          console.error(err)
        }
      })
      console.log("hi");
      account = accounts[0];
    }

  var web3 = new Web3(window.ethereum);
  const bal = await web3.eth.getBalance(account);
  //console.log("hi");
  console.log(bal);
  console.log(account);
  localStorage.setItem("acc",account.toString());
  const tnow = Date.now();
  localStorage.setItem('last_session', tnow.toString());
  localStorage.setItem("last_chain", chain);
  document.getElementById('nright').innerHTML = `
    <a>`.concat(account.slice(0,10).concat('...')).concat(`</a>
    <a style="color: black; background-color: #ff6600; cursor: pointer; border-radius: 5%;padding: 1%; padding-bottom: 2%" onclick='logout();'>logout</a>
  `);
  }
}

async function checkIfHighscore(scr, gid){
  const chn = localStorage.getItem("last_chain");
  const acc = localStorage.getItem("acc");
  const web3 = new Web3(window.ethereum);
  var abiInstance;
  var contract;

  if (chn == "" || chn == null || acc == "" || acc == null){
    return false;
  }

  if (chn == 'eth'){
      abiInstance = ABIETH.abi;
      contract = new web3.eth.Contract(
                                  abiInstance,
                    "0xdbd0b45076a748270e62d5378c233981db78d581");
  }
  else if (chn == 'mnt'){
      abiInstance = ABIMNT.abi;
      contract = new web3.eth.Contract(
                                  abiInstance,
                    "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
  }
  else if (chn == 'lsk'){
      abiInstance = ABILSK.abi;
      contract = new web3.eth.Contract(
                                  abiInstance,
                    "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
  }
  else if (chn == 'flr'){
      abiInstance = ABIFLR.abi;
      contract = new web3.eth.Contract(
                                  abiInstance,
                    "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
  }
  else if (chn == 'gvt'){
      abiInstance = ABIGVT.abi;
      contract = new web3.eth.Contract(
                                  abiInstance,
                    "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
  }
  else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
  else {
      console.log('unknown chain');
      return false;
  }


  var s1 = 0;

  try  {
    const arg1 = BigInt(gid);
    var res1 = await contract.methods['fetch_myscore'](arg1).call({from: acc});
    s1 = res1;
  }
  catch (err){
    console.log(err);
  }

  if (scr > s1){
    return true;
  }
  else {
    return false;
  }

  return false;

}

async function getMyScore() {
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    const web3 = new Web3(window.ethereum);
    var abiInstance;
    var contract;

    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xdbd0b45076a748270e62d5378c233981db78d581");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else {
        console.log('unknown chain');
        return;
    }
  

  var s1 = 0;
  var s2 = 0;
  var s3 = 0;

  try  {
    const arg1 = BigInt(1);
    var res1 = await contract.methods['fetch_myscore'](arg1).call({from: acc});
    s1 = res1;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg2 = BigInt(2);
    var res2 = await contract.methods['fetch_myscore'](arg2).call({from: acc});
    s2 = res2;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg3 = BigInt(3);
    var res3 = await contract.methods['fetch_myscore'](arg3).call({from: acc});
    s3 = res3;
  }
  catch (err){
    console.log(err);
  }

  document.getElementById('g1scr').textContent = s1.toString();
  document.getElementById('g2scr').textContent = s2.toString();
  document.getElementById('g3scr').textContent = s3.toString();


}
window.getMyScore = getMyScore;


async function getTopScore() {
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    const web3 = new Web3(window.ethereum);
    var abiInstance;
    var contract;

    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xdbd0b45076a748270e62d5378c233981db78d581");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else {
        console.log('unknown chain');
        return;
    }


  var s1 = 0;
  var s2 = 0;
  var s3 = 0;
  var a1 = 'null';
  var a2 = 'null';
  var a3 = 'null';

  try  {
    const arg1 = BigInt(1);
    var res1 = await contract.methods['fetch_bestscore'](arg1).call({from: acc});
    s1 = res1;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg2 = BigInt(2);
    var res2 = await contract.methods['fetch_bestscore'](arg2).call({from: acc});
    s2 = res2;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg3 = BigInt(3);
    var res3 = await contract.methods['fetch_bestscore'](arg3).call({from: acc});
    s3 = res3;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg1 = BigInt(1);
    var res4 = await contract.methods['fetch_best'](arg1).call({from: acc});
    a1 = res4;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg2 = BigInt(2);
    var res5 = await contract.methods['fetch_best'](arg2).call({from: acc});
    a2 = res5;
  }
  catch (err){
    console.log(err);
  }

  try  {
    const arg3 = BigInt(3);
    var res6 = await contract.methods['fetch_best'](arg3).call({from: acc});
    a3 = res6;
  }
  catch (err){
    console.log(err);
  }

  if (a1.length > 10){
    a1 = a1.slice(0,10).concat('...').concat(a1.slice(a1.length - 10, a1.length));
  }
  if (a2.length > 10){
    a2 = a2.slice(0,10).concat('...').concat(a2.slice(a2.length - 10, a2.length));
  }
  if (a3.length > 10){
    a3 = a3.slice(0,10).concat('...').concat(a3.slice(a3.length - 10, a3.length));
  }

  document.getElementById('b1scr').textContent = s1.toString();
  document.getElementById('l1scr').textContent = ' {'.concat(a1).concat(' }');
  document.getElementById('b2scr').textContent = s2.toString();
  document.getElementById('l2scr').textContent = ' {'.concat(a2).concat(' }');
  document.getElementById('b3scr').textContent = s3.toString();
  document.getElementById('l3scr').textContent = ' {'.concat(a3).concat(' }');


}
window.getTopScore = getTopScore;


// connects metamask to the flare testnet (coston2)
var key = Array(25).fill().map(() => Array(25).fill(0));
var op = Array(25).fill().map(() => Array(25).fill(0));
var mayhem_time = Date.now();


var mm = Array(8).fill().map(() => Array(8).fill(0));
var covered = [];
var a_cell = [-1,-1];
var a_id = "";
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "#000099", "#6495ed",
                "grey", "pink", "aqua", "gold", "crimson", "chocolate", "#455a64", "silver",
                "#ff99cc", "#66cccc", "#8b9467", "magenta", "teal", "coral", "salmon", "#aaaaaa",
                "#88cc88", "navy", "lime", "olive", "maroon", "#663300", "#ccccff", "tan",
                "#999999", "#cc99ff","#cc6666", "#3399ff", "powderblue", "seagreen", "black"];

var r_clues = [];
var c_clues = [];
var nono_fin = Array(8).fill().map(() => Array(8).fill(0));
var nono_cur = Array(8).fill().map(() => Array(8).fill(0));
var nono_clicks = 0;
var nono_time = Date.now();

var last_click = 0;
var mental_clicks = 0;
var mental_time = Date.now();

var sessionId = "";

const sph1 = '1|0x219964C4f9216dbF793f82E51b7361C6fCFD1EA7|GVT|30013|2025-06-05T08:18:33.112Z,2|0x2aba4dB03a9b086f7149d6FDCd01ED3bAE950626|SKL|30003|2025-06-02T07:50:02.887Z,3|0x78ac97d17Bf88C2782875b272B11E4D0C32F3D85|GVT|29357|2025-06-13T08:59:19.232Z,4|0xd2321B9E34C928a475f25eb37327AEEcf0962E6c|FLR|28775|2025-05-30T06:57:42.183Z,5|0x5C7fA034Bcc308AFcCa8F93FFe5E38838b038F09|SKL|27311|2025-06-04T07:14:47.501Z,6|0x20Bc681Ec7DBCd73CF7b482A8235A44368D48B34|SKL|26553|2025-06-04T08:23:18.112Z,7|0x2aba4dB03a9b086f7149d6FDCd01ED3bAE950626|GVT|26553|2025-06-04T07:28:37.462Z,8|0x3Fc9bc81D4737049E6F0356565E0fbA40afF9808|GVT|25610|2025-06-06T07:05:51.984Z,9|0xB1dfA879a8273bC25946AA14598cB96BFEce2D49|GVT|23332|2025-05-28T09:54:05.179Z,10|0x6d74f6d4685b768bfe54d9d40fa5b8e47d8f7939|SKL|22804|2025-05-28T09:29:53.438Z,11|0x61aB9c0fD6180B413a8fF8AbBcA4b0488a529b69|FLR|21598|2025-05-29T09:06:49.423Z,12|0xB1dfA879a8273bC25946AA14598cB96BFEce2D49|LSK|21011|2025-05-28T10:10:39.585Z,13|0x1A1D98F8588F554dB2958Be4D32Ae51B3880D43e|SKL|21007|2025-05-30T07:07:52.475Z,14|0x78ac97d17Bf88C2782875b272B11E4D0C32F3D85|GVT|20777|2025-05-30T07:34:03.700Z,15|0x4B938dD2D0809DFE40A437CD77f1372B5DB5686B|FLR|20204|2025-05-29T09:12:55.848Z,16|0x688b3Ea10E7DF066285796bf2d6e2f1e54D60064|SKL|20117|2025-06-05T07:52:42.664Z,17|0xBfE4BC2afc519606Ca9bbdA57EEe1686e93cCa0A|MNT|19915|2025-05-29T08:23:31.794Z,18|0x8E3b4eEc9e40E3009ee200F91bFd9c232f7f7f15|GVT|19821|2025-06-06T06:54:12.844Z,19|0x5420E9017AF764C5fA53eafd67F94Bf66b0Ae5E6|GVT|18473|2025-06-03T14:40:09.217Z,20|0x474D6429412085Bdc499aac66d3891D39BDFCff9|SKL|18361|2025-06-02T08:46:15.733Z,';

const sph2 = '1|0xB1dfA879a8273bC25946AA14598cB96BFEce2D49|LSK|3747|2025-05-28T10:08:47.274Z,2|0xB1dfA879a8273bC25946AA14598cB96BFEce2D49|GVT|3613|2025-05-28T10:40:38.953Z,3|0x8Da0Cf3564A5467EC6bcDDb217718840A82b308c|GVT|3259|2025-06-05T08:04:10.695Z,4|0x8dc2f551c50F95BF9065C3cb3620611Ce97307F8|MNT|3131|2025-05-29T08:04:32.000Z,5|0xeaCA3244d94fF0c64d56761988abb6CA76a9F1be|GVT|2931|2025-06-04T08:35:46.957Z,6|0x4CcdEe3bb8b8324f0B91126f35EDe4b5B51ec19A|SKL|2830|2025-06-02T08:56:34.621Z,7|0x27f49965A4bdCcB6f1af869B6aEbf74ce70cCEB5|SKL|2628|2025-06-05T07:43:53.970Z,8|0x78ac97d17Bf88C2782875b272B11E4D0C32F3D85|GVT|2501|2025-06-02T07:41:52.735Z,9|0xd2321B9E34C928a475f25eb37327AEEcf0962E6c|FLR|2442|2025-05-29T10:06:54.594Z,10|0x5c31E7D223865fef23BA5198fc90A122CA374Bc4|GVT|2439|2025-06-06T06:49:00.341Z,11|0x61aB9c0fD6180B413a8fF8AbBcA4b0488a529b69|FLR|2278|2025-05-29T09:00:21.982Z,12|0x5C7fA034Bcc308AFcCa8F93FFe5E38838b038F09|SKL|2265|2025-05-30T07:52:38.496Z,13|0x2aba4dB03a9b086f7149d6FDCd01ED3bAE950626|GVT|2091|2025-05-30T07:37:49.982Z,14|0xc06D110Bf03aDAA42C60FDDB5d80fd0C1e86E7c2|SKL|2060|2025-05-30T07:13:07.741Z,15|0x15D3C1c3f7E1fe5347CF16aC3C4fb770E640c63b|FLR|2016|2025-06-03T14:37:01.026Z,16|0xBfE4BC2afc519606Ca9bbdA57EEe1686e93cCa0A|MNT|2006|2025-05-29T08:30:03.952Z,17|0x4B938dD2D0809DFE40A437CD77f1372B5DB5686B|FLR|1993|2025-05-29T09:19:08.645Z,18|0x8E3b4eEc9e40E3009ee200F91bFd9c232f7f7f15|GVT|1992|2025-06-02T09:02:39.224Z,19|0xd73Bd123d7D399D5CD498F8b3f4F653F8Fe27e65|SKL|1854|2025-06-04T07:19:14.628Z,20|0x6d74f6d4685b768bfe54d9d40fa5b8e47d8f7939|SKL|1804|2025-05-28T09:24:37.211Z,';

const sph3 = '1|0x99E90CEe9A53D9171fc25CA143004f8f209858E3|GVT|343|2025-06-13T09:06:44.361Z,2|0x5c31E7D223865fef23BA5198fc90A122CA374Bc4|GVT|299|2025-06-04T08:41:33.264Z,3|0x27f49965A4bdCcB6f1af869B6aEbf74ce70cCEB5|SKL|283|2025-06-04T08:31:08.880Z,4|0xB1dfA879a8273bC25946AA14598cB96BFEce2D49|LSK|257|2025-05-28T10:33:18.143Z,5|0x61aB9c0fD6180B413a8fF8AbBcA4b0488a529b69|FLR|249|2025-05-29T08:56:14.176Z,6|0xd73Bd123d7D399D5CD498F8b3f4F653F8Fe27e65|SKL|249|2025-05-30T07:41:31.431Z,7|0xABDaF1cBfF6Fdac48035967C63dBb4b0a0E394d9|SKL|233|2025-05-30T07:17:38.510Z,8|0x8E3b4eEc9e40E3009ee200F91bFd9c232f7f7f15|GVT|223|2025-06-03T14:43:29.619Z,9|0x15D3C1c3f7E1fe5347CF16aC3C4fb770E640c63b|FLR|219|2025-06-05T08:25:28.886Z,10|0xBfE4BC2afc519606Ca9bbdA57EEe1686e93cCa0A|MNT|212|2025-05-29T08:38:06.954Z,11|0x4B938dD2D0809DFE40A437CD77f1372B5DB5686B|FLR|209|2025-05-29T09:25:53.242Z,12|0x5420E9017AF764C5fA53eafd67F94Bf66b0Ae5E6|GVT|199|2025-06-02T09:11:25.138Z,13|0xd2321B9E34C928a475f25eb37327AEEcf0962E6c|FLR|198|2025-05-29T09:51:30.511Z,14|0x6d74f6d4685b768bfe54d9d40fa5b8e47d8f7939|SKL|193|2025-05-28T09:20:50.943Z,15|0xB1dfA879a8273bC25946AA14598cB96BFEce2D49|GVT|192|2025-05-28T10:38:58.422Z,16|0x8dc2f551c50F95BF9065C3cb3620611Ce97307F8|MNT|190|2025-05-29T08:10:20.729Z,17|0x20Bc681Ec7DBCd73CF7b482A8235A44368D48B34|SKL|181|2025-06-05T07:46:59.276Z,18|0x5C7fA034Bcc308AFcCa8F93FFe5E38838b038F09|SKL|177|2025-06-02T07:55:35.730Z,19|0x2aba4dB03a9b086f7149d6FDCd01ED3bAE950626|GVT|174|2025-06-02T07:47:07.226Z,20|0xD0dC8A261Ad1B75A92C5e502AE10c3Fde042b879|GVT|168|2025-06-02T09:31:15.561Z,';




async function to_home(){
  window.location.href = "./";
}
window.to_home = to_home;


async function to_launch(game){
  window.location.href = "./launch.html?".concat(game);
}
window.to_launch = to_launch;



async function load_this_game(){
  sessionId = (Date.now()).toString();
  localStorage.setItem('session_id', sessionId);
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 1200 || h < 540){
    document.getElementById('bod').innerHTML = `
      <h1 style='color: red'>Screen Too Small</h1>
      <div style="color: whitesmoke;font-size: 1.3em;text-align: left;margin-left: 5%;margin-right: 5%">Megusta currently only supports wider PCs for gameplay. Since mobile devices make swift and precise clicking difficult, they are not currently supported.</div>
      <div style="color: whitesmoke;font-size: 1.3em;text-align: left;margin-left: 5%;margin-right: 5%">Please use a supported device or try again later.</div>
      <canvas id="game" width="620" height="620" style="display:none"></canvas>
    `;
    return;
  }

  var url = window.location.toString();
  var game_name = url.substring(url.indexOf('?') + 1);
  if (game_name == 'pixelmayhem'){
    console.log('this is '.concat(game_name));
    document.getElementById('game_title').textContent = 'Pixel Mayhem';
    document.getElementById('bod').innerHTML = `

      <h1 style="color: purple;">Pixel Mayhem</h1>
      <div class="left_cell">
            <table id="pixel_canvas" style="background-color: white;">

            <tr id="r11" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r12" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r13" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r14" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r15" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r16" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r17" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r18" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r19" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r110" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r111" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r112" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r113" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r114" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r115" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r116" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r117" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r118" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r119" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r120" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r121" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r122" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r123" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r124" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r125" style="height: 20px; min-height: 20px;"></tr>

            </table>
            <br>
            <span id="message" style="display: none;"></span>
            <br>
            <span class="countA" style="display: none;">| Total clicks: <span id="countArea">0</span> |</span>
        </div>
        <div class="right_cell">
            <table id="pixel_canvas" style="background-color: white;">

            <tr id="r21" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r22" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r23" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r24" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r25" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r26" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r27" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r28" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r29" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r210" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r211" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r212" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r213" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r214" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r215" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r216" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r217" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r218" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r219" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r220" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r221" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r222" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r223" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r224" style="height: 20px; min-height: 20px;"></tr>
            <tr id="r225" style="height: 20px; min-height: 20px;"></tr>

            </table>
            <br>
            <span id="message" style="display: none;"></span>
            <br>
            <span class="countA" style="display: none;">| Total clicks: <span id="countArea">0</span> |</span>
        </div>
        <div >
          <div style="width: 10%; height: 4%;font-size: 1.3em; cursor:pointer;color:#fefefe;background-color:purple;display:inline-block;" onclick="to_rules();">Rules</div>
          <div style="width: 10%; height: 4%;font-size: 1.3em; cursor:pointer;color:#fefefe;background-color:purple;display:inline-block;" onclick="get_key();">Get Key</div>
        </div>

        `;
    var i = 1;
  while (i < 26){
    var el1 = document.getElementById('r1'.concat(i.toString()));
    var el2 = document.getElementById('r2'.concat(i.toString()));
    var j = 1;
    while (j < 26){
      var id1= "c1".concat(i.toString().concat("x").concat(j.toString()));
      var id2= "c2".concat(i.toString().concat("x").concat(j.toString()));
      el1.innerHTML = el1.innerHTML + `
        <td id="`.concat(id1).concat(`" style="width: 20px; min-width: 20px;" onclick="cell_click(`.concat(id1).concat(`)"></td>
      `));
      el2.innerHTML = el2.innerHTML + `
        <td id="`.concat(id2).concat(`" style="width: 20px; min-width: 20px;" onclick="cell_click(`.concat(id2).concat(`)"></td>
      `));
      j++;
    }


    i++;
  }
    start_game_mayhem();
  }
  else if (game_name == 'snake') {
    console.log('this is '.concat(game_name));
    document.getElementById('game_title').textContent = "Good Ol' Snake";
    document.getElementById('bod').innerHTML = `
    <br/><br/>
    <div style="color: purple;font-size: 4em;font-family:monospace;">Good Ol' Snake</div>
    <br/>

     <canvas id="game2" width="525" height="525" ></canvas>

     <div style="left: 30%;">
            <br/>
            <div id="restart" onclick="to_rules();" style="color:white;background-color: purple;font-size: 2em; width: 7%;height:6%; text-align: center;  cursor: pointer;display: inline-block;">Rules</div>
             <div id="restart" onclick="reloadSnake();" style="color:white;background-color: purple;font-size: 2em; width: 7%;height:6%; text-align: center;  cursor: pointer;display: inline-block;">Retry!</div>
      </div>
    `;
    canvas=document.getElementById('game2');
    ctx=canvas.getContext('2d');
    tileSize=canvas.clientWidth/tileCount-2;
    drawGame();
  }
  else if (game_name == 'monumental') {
    console.log('this is '.concat(game_name));
    document.getElementById('game_title').textContent = 'Monu-Mental';
    document.getElementById('bod').innerHTML = `
      <h1 style="color: purple;">Monu-Mental</h1>

        <div class="central_cell">
            <table id="pixel_table" style="background-color: white;width: 40%">

            <tr id="m1" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m2" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m3" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m4" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m5" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m6" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m7" style="height: 60px; min-height: 60px;"></tr>
            <tr id="m8" style="height: 60px; min-height: 60px;"></tr>




            </table>
            <br>
            <span id="message" style="display: none;"></span>
            <br>
            <span class="countA" style="display: none;">| Total clicks: <span id="countArea">0</span> |</span>
        </div>
        <div>
              <br/>
              <div id="start" onclick="to_rules();" style="color:white;background-color: purple;font-size: 2em; width: 7%;height:6%; text-align: center; cursor: pointer;display:inline-block;margin-left: 4%;margin-right: 0.2%;">Rules</div>
              <div id="start" onclick="submitMental();" style="color:white;background-color: purple;font-size: 2em; width: 7%;height:6%; text-align: center; cursor: pointer;display:inline-block;margin-right: 0.2%;">Submit</div>
              <div id="restart" onclick="restartMental();" style="color:white;background-color: purple;font-size: 2em; width: 10%;height:6%; text-align: center; cursor: pointer;display:inline-block;">New Game</div>
        </div>

        `;
        var i = 1;
        while (i < 9){
          var el = document.getElementById('m'.concat(i.toString()));
          var j = 1;
          while (j < 9){
            var id0= "c".concat(i.toString().concat("x").concat(j.toString()));
            el.innerHTML = el.innerHTML + `
              <td id="`.concat(id0).concat(`" style="width: 20px; min-width: 20px;text-align:center;" onclick="cell_click2(`.concat(id0).concat(`)"></td>
            `));

            j++;
          }


          i++;
        }
      start_game_mental();
  }
  else if (game_name == "nonogram"){
    document.getElementById('game_title').textContent = 'Nonogram';
    document.getElementById("bod").innerHTML = `
       <h1 style="color: purple;">Nonogram</h1>

        <div class="central_cell">
            <table id="nono_table" style="background-color: white;width: 40%">

            <tr id="n0" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n1" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n2" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n3" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n4" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n5" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n6" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n7" style="height: 60px; min-height: 60px;"></tr>
            <tr id="n8" style="height: 60px; min-height: 60px;"></tr>




            </table>

            <span class="countA" style="display: none;">| Total clicks: <span id="countArea">0</span> |</span>
        </div>
        <div>
              <br/>
              <div id="start" onclick="to_rules();" style="color:white;background-color: purple;font-size: 1.6em; width: 7%; text-align: center; cursor: pointer;display:inline-block;margin-left: 4%;margin-right: 0.2%;">Rules</div>
              <div onclick='check_nono();' style="color: white;background-color: purple;font-size: 1.6em;width:13%;display:inline-block;cursor: pointer;">Check Solution</div>
              <div id="restart" onclick="restartNono();" style="color:white;background-color: purple;font-size: 1.6em; width: 10%; text-align: center; cursor: pointer;display:inline-block;">New Game</div>
        </div>
    `;
    var i = 0;
        while (i < 9){
          var el = document.getElementById('n'.concat(i.toString()));
          var j = 0;
          while (j < 9){
            var id0= "cn".concat(i.toString().concat("x").concat(j.toString()));
            if (j == 0 && i == 0){
              el.innerHTML = el.innerHTML + `
              <td id="`.concat(id0).concat(`" style="width: 20px; min-width: 20px;background-color:black;"></td>
            `);
            }
            else if (j == 0){
              el.innerHTML = el.innerHTML + `
              <td id="`.concat(id0).concat(`" style="width: 20px; min-width: 20px;text-align:center;background-color:yellow;"></td>
            `);

            }
            else if (i == 0){
              el.innerHTML = el.innerHTML + `
              <td id="`.concat(id0).concat(`" style="width: 20px; min-width: 20px;text-align:center;background-color:yellow;"></td>
            `);

            }
            else {
              el.innerHTML = el.innerHTML + `
              <td id="`.concat(id0).concat(`" style="width: 20px; min-width: 20px;text-align:center;" onclick="cell_click3(`.concat(id0).concat(`)"></td>
            `));
            }



            j++;
          }


          i++;
        }
        start_game_nono();
    }
    else if (game_name == 'spacerumble'){
      console.log('this is '.concat(game_name));
      document.getElementById('game_title').textContent = 'Space Rumble';
      var ch = 375;
      var cw = 600;
      var fsz = 3;
      var mt = 8;
      console.log(h);
      if (h >= 725){
        ch = 600;
        cw = 800;
        fsz = 4;
        mt = 15;
      };
      var content_perc = ((w - (10*cw)/8) * 100) / w;
      const ml = (Math.floor(content_perc/2)).toString().concat("%");
      document.getElementById('bod').innerHTML = `
      <br/><br/>
      <div style="color: #ff9933;font-size: `.concat(fsz).concat(`em;font-family:monospace;">Space Rumble</div>
      <br/>

       <div style="display: flex; align-items: flex-start;margin-left: `.concat(ml).concat(`">
        <div style="margin-right: 1%; margin-top: `.concat(mt.toString()).concat(`%">
              <br/>
              <div id="start" onclick="to_rules();" style="color:black;background-color: #ff9933;font-size: 2em;height:6%; text-align: center; cursor: pointer;margin-bottom: 5%;padding: 5px;">Rules</div>
              <div id="start" onclick="to_scores();" style="color:black;background-color: #ff9933;font-size: 2em;height:6%; text-align: center; cursor: pointer;margin-bottom: 5%;padding: 5px;">Scores</div>
              <div id="start" onclick="preloadRun();" style="color:black;background-color: #ff9933;font-size: 2em;height:6%; text-align: center; cursor: pointer;margin-bottom: 5%;padding: 5px;">Play!</div>
              <div id="restart" onclick="restartRun();" style="color:black;background-color: #ff9933;font-size: 2em;height:6%; text-align: center; cursor: pointer;padding-top: 4%;padding-bottom: 3%;padding: 5px">Retry</div>
        </div>
        <canvas id="game2" width="`.concat(cw.toString()).concat(`" height="`.concat(ch.toString()).concat(`" ></canvas>
      </div>
      `)))));
      canvas3=document.getElementById('game2');
      ctx3=canvas3.getContext('2d');
      ctx3.fillStyle = 'pink';
      setupRun();
    }
    else if (game_name == "tilegusta"){
      console.log('this is '.concat(game_name));
      document.getElementById('game_title').textContent = 'Tile Gusta';
      const h = window.innerHeight;
      var ch = 480;
      var cw = 240;
      var ct = "8%";
      var fsz = "1.5em";
      var bw1 = "7%";
      var bw2 = "7%";
      console.log(h);
      if (h >= 725){
        ch = 640;
        cw = 320;
        ct = "15%";
        fsz = "1.9em";
        bw1 = "8%";
        bw2 = "9%";
      };
      document.getElementById('bod').innerHTML = `
      <div style="position: absolute; left: 10%; top: `.concat(ct).concat(`;width: 35%;">
        <h1 style="color:#ff9933; font-size: 4em; ">Tile Gusta</h1>
        <div style="color: #ff9933;font-weight: 800;font-size:1.5em;background-color:purple;padding: 4px">Play the all time classic game on Web 3</div><br/>
        <div style="color: #ff9933;font-weight:800;font-size:1.5em;">Rules: <br/>You can only move the pieces in specific ways. <br/>Your game is over if your pieces reach the top of the screen, <br/>and you can only remove pieces from the screen <br/>by filling all the blank space in a line.</div>
        <div id="start" onclick="to_scores();" style="color:black;background-color: #ff9933;font-size: 1.9em; text-align: center; cursor: pointer;display:inline-block;margin-top:1%;padding: 4px;">Check Your Scores</div>
      </div><br/>
      <canvas id="game2" width="`.concat(cw.toString()).concat(`" height="`.concat(ch.toString()).concat(`" style="margin-left: 30%"></canvas>

      <div style="margin-left: 30%;margin-top: 7px;">
              <div id="start" onclick="to_rules();" style="color:black;background-color: #ff9933;font-size: `.concat(fsz).concat(`; width: `.concat(bw1).concat(`; text-align: center; cursor: pointer;display:inline-block;margin-right:1%;padding: 2px;">Rules</div>

              <div id="start" onclick="reloadTilegusta();" style="color:black;background-color: #ff9933;font-size: `.concat(fsz).concat(`; width: `.concat(bw1).concat(`; text-align: center; cursor: pointer;display:inline-block;margin-right:1%;padding: 2px;">Play!</div>

              <div id="restart" onclick="restartTilegusta();" style="color:black;background-color: #ff9933;font-size: `.concat(fsz).concat(`; width: `.concat(bw2).concat(`; text-align: center; cursor: pointer;display:inline-block;padding: 2px;">Retry</div>
        </div>
      `)))))))));
      canvas4=document.getElementById('game2');
      ctx4=canvas4.getContext('2d');
      ctx4.fillStyle = 'pink';
      ctx4.fillRect(0, 0, canvas4.width, canvas4.height);
    }
    else if (game_name == "flapperoo"){
      console.log('this is '.concat(game_name));
      document.getElementById('game_title').textContent = 'Flapperoo';
      const h = window.innerHeight;
      var ch = 450;
      var cw = 350;
      var ct = "8%";
      var fsz = "1.5em";
      var bw1 = "7%";
      var bw2 = "7%";
      console.log(h);
      if (h >= 725){
        ch = 600;
        cw = 400;
        ct = "15%";
        fsz = "1.9em";
        bw1 = "8%";
        bw2 = "9%";
      };
      document.getElementById('bod').innerHTML = `
      <div style="position: absolute; left: 10%; top: `.concat(ct).concat(`;width: 35%;">
        <h1 style="color:#ff9933; font-size: 4em; ">Flapperoo</h1>
        <div style="color: #ff9933;font-weight: 800;font-size:1.5em;background-color:purple;padding: 4px">Play the all time classic game on Web 3</div><br/>
        <div style="color: #ff9933;font-weight:800;font-size:1.5em;">Rules: <br/>Save the bird from the pipes. <br/>You can only move UP, <br/>so be careful! <br/></div>
        <div id="scrs" onclick="to_scores();" style="color:black;background-color: #ff9933;font-size: 1.9em; text-align: center; cursor: pointer;display:inline-block;margin-top:1%;padding: 4px;">Check Your Scores</div>
      </div><br/>
      <canvas id="game2" width="`.concat(cw.toString()).concat(`" height="`.concat(ch.toString()).concat(`" style="margin-left: 30%"></canvas>

      <div style="margin-left: 30%;margin-top: 7px;">
              <div id="start" onclick="to_rules();" style="color:black;background-color: #ff9933;font-size: `.concat(fsz).concat(`; width: `.concat(bw1).concat(`; text-align: center; cursor: pointer;display:inline-block;margin-right:1%;padding: 2px;">Rules</div>

              <div id="start" onclick="reloadFlap();" style="color:black;background-color: #ff9933;font-size: `.concat(fsz).concat(`; width: `.concat(bw1).concat(`; text-align: center; cursor: pointer;display:inline-block;margin-right:1%;padding: 2px;">Play!</div>

              <div id="restart" onclick="restartFlap();" style="color:black;background-color: #ff9933;font-size: `.concat(fsz).concat(`; width: `.concat(bw2).concat(`; text-align: center; cursor: pointer;display:inline-block;padding: 2px;">Retry</div>
        </div>
      `)))))))));
      canvas6=document.getElementById('game2');
      ctx6=canvas6.getContext('2d');
      ctx6.fillStyle = '#87CEEB';
      ctx6.fillRect(0, 0, canvas6.width, canvas6.height);
    }
    else {
      document.getElementById("bod").innerHTML = `
        <div class="homeText3">This page does not exist. Are you choosing a valid game?</div>
      `;
    }

}
window.load_this_game = load_this_game;


// pixel mayhem part

async function cell_click(idx){
  var id = idx.id.toString();
  if (id[1] == "1"){
    console.log('first grid');
    var sp = id.split("c1");
    var grids = sp[1].split("x");
    console.log(grids);
  }
  else if (id[1] == "2"){
    console.log("second grid");
    var sp = id.split("c2");
    var grids = sp[1].split("x");
    console.log(grids);
    const val = op[grids[0] - 1][grids[1] - 1];
    if (val == 0){
      op[grids[0] - 1][grids[1] - 1] = 1;
      document.getElementById(id).style.backgroundColor = 'purple';
    }
    else {
      op[grids[0] - 1][grids[1] - 1] = 0;
      document.getElementById(id).style.backgroundColor = 'white';
    }

  }
  else {
    console.log("wtf just happened man");
  }
}
window.cell_click = cell_click;

function start_game_mayhem(){
  var i = 1;
  var j = 1;
  key = Array(25).fill().map(() => Array(25).fill(0));
  op = Array(25).fill().map(() => Array(25).fill(0));
  mayhem_time = Date.now();
  while (i < 26){
    j = 1;
    while (j < 26){
      var r = Math.floor(Math.random() * 10);
      if (r > 4){
        var id= "c1".concat(i.toString().concat("x").concat(j.toString()));
        document.getElementById(id).style.backgroundColor = 'purple';
        key[i - 1][j - 1] = 1;
      }
      else {
        key[i - 1][j - 1] = 0;
      }
      j++;
    }
    i++;
  }
}

async function get_key(){
  console.log(key);
  console.log(op);
  var flag = true;
  for (var i = 0; i < key.length; i++){
    for (var j = 0; j < key.length; j++){
      if (op[i][j] != key[i][j]){
        flag = false;
        break;
      }
    }
  }
  console.log(flag);
  const time_elapsed = Date.now() - mayhem_time;
  console.log(time_elapsed);
}
window.get_key = get_key;


// snake part

var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');

var background = new Image();
//background.src = "./img/favicon.ico";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background,400,400);
}

class snakePart{
constructor(x, y){
    this.x=x;
    this.y=y;
}

}

let speed=5;
let tileCount=23;

var tileSize=canvas.clientWidth/tileCount-2;
let headX=10;
let headY=10;
console.log(canvas.clientWidth);
console.log(tileSize);
// array for snake parts
const snakeParts=[];
let tailLength=0;

//initialize the speed of snake
let xvelocity=0;
let yvelocity=0;

//draw apple
let appleX=5;
let appleY=5;

//scores
let score=0;

//direction
var dir = "";

// create game loop-to continously update screen
function drawGame(){
    changeSnakePosition();
    // game over logic
    let result=isGameOver();
    if(result){// if result is true
        return;
    }
    clearScreen();
    drawBG();
    drawSnake();
    drawApple();
    checkCollision()
    drawScore();
    setTimeout(drawGame, 1000/speed);//update screen 7 times a second
}
//Game Over function
function isGameOver(){
    let gameOver=false;
    //check whether game has started
    if(yvelocity===0 && xvelocity===0){
        //console.log("case 1");
        return false;
    }
    if(headX<0){//if snake hits left wall
        //console.log("case 2");
        gameOver=true;
    }
    else if(headX===tileCount){//if snake hits right wall
        //console.log("case 3");
        gameOver=true;
    }
    else if(headY<0){//if snake hits wall at the top
        //console.log("case 4");
        gameOver=true;
    }
    else if(headY===tileCount){//if snake hits wall at the bottom
        //console.log("case 5");
        gameOver=true;
    }

    //stop game when snake crush to its own body

     for(let i=0; i<snakeParts.length;i++){
         let part=snakeParts[i];
         if(part.x===headX && part.y===headY){//check whether any part of snake is occupying the same space
             gameOver=true;
             break; // to break out of for loop
         }
     }


    //display text Game Over
    if(gameOver){
      ctx.fillStyle = 'black';
      ctx.globalAlpha = 0.75;
      ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

      ctx.globalAlpha = 1;
      ctx.fillStyle = 'white';
      ctx.font = '22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GAME OVER! Your score is '.concat(score.toString()), canvas.width / 2, canvas.height / 2);

    }

    return gameOver;// this will stop execution of drawgame method
}

// score function
function drawScore(){
ctx.fillStyle="black"// set our text color to white
ctx.font="10px verdena"//set font size to 10px of font family verdena
ctx.fillText("Score: " +score, canvas.clientWidth-50,10);// position our score at right hand corner

}

// clear our screen
 function clearScreen(){

ctx.fillStyle= 'pink'// make screen black
ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight)// black color start from 0px left, right to canvas width and canvas height

 }
 function drawSnake(){

    ctx.fillStyle="#009900";
    //loop through our snakeparts array
    for(let i=0;i<snakeParts.length;i++){
        //draw snake parts
        let part=snakeParts[i]
         ctx.fillRect(part.x *tileCount, part.y *tileCount, tileSize,tileSize)
    }
    //add parts to snake --through push
    snakeParts.push(new snakePart(headX,headY));//put item at the end of list next to the head
    if(snakeParts.length>tailLength){
        snakeParts.shift();//remove furthest item from  snake part if we have more than our tail size

    }
    ctx.fillStyle="#007700";
    ctx.fillRect(headX* tileCount,headY* tileCount, tileSize,tileSize)

    if (dir=="up"){
      ctx.fillStyle = "pink"
      ctx.beginPath()
      ctx.moveTo(headX*tileCount, headY*tileCount)
      ctx.lineTo(headX*tileCount + tileSize/2, headY*tileCount + 2*tileSize/3)
      ctx.lineTo(headX*tileCount + tileSize, headY*tileCount)
      ctx.fill()
    }
    else if (dir == "down"){
      ctx.fillStyle = "pink"
      ctx.beginPath()
      ctx.moveTo(headX*tileCount, headY*tileCount + tileSize)
      ctx.lineTo(headX*tileCount + tileSize/2, headY*tileCount + tileSize/3)
      ctx.lineTo(headX*tileCount + tileSize, headY*tileCount + tileSize)
      ctx.fill()
    }
    else if (dir == "right"){
      ctx.fillStyle = "pink"
      ctx.beginPath()
      ctx.moveTo(headX*tileCount + tileSize, headY*tileCount)
      ctx.lineTo(headX*tileCount + tileSize/3, headY*tileCount + tileSize/2)
      ctx.lineTo(headX*tileCount + tileSize, headY*tileCount + tileSize)
      ctx.fill()
    }
    else if (dir == "left"){
      ctx.fillStyle = "pink"
      ctx.beginPath()
      ctx.moveTo(headX*tileCount, headY*tileCount)
      ctx.lineTo(headX*tileCount + 2*tileSize/3, headY*tileCount + tileSize/2)
      ctx.lineTo(headX*tileCount, headY*tileCount + tileSize)
      ctx.fill()
    }
    else {}





 }
 function changeSnakePosition(){
     headX=headX + xvelocity;
     headY=headY+ yvelocity;

 }
 function drawApple(){
    //console.log("being called");
      ctx.beginPath();
      ctx.arc(appleX*tileCount + tileSize/2, appleY*tileCount + tileSize/2, tileSize/2, 0, 2*Math.PI);
     ctx.fillStyle="red";
     ctx.fill();

     //ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize)
 }
 // check for collision and change apple position
 function checkCollision(){
     if(appleX==headX && appleY==headY){
        console.log("hey");
         appleX=Math.floor(Math.random()*tileCount);
         appleY=Math.floor(Math.random()*tileCount);
         tailLength++;
         score++; //increase our score value

     }
 }


function reloadSnake(){
  window.location.reload();
}
window.reloadSnake = reloadSnake;

function drawBG(){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background,400,400);
}
window.drawBG = drawBG;



// mental part

function shuffle_arr(arr){
  var i;
  for (i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function one_to_two_d(arr){
  return Array(8).fill().map((_, i) => arr.slice(i * 8, (i + 1) * 8));
}

function start_game_mental(){
  var i = 1;
  var j = 0;
  mm = Array(10).fill().map(() => Array(10).fill(0));
  covered = [];
  mental_clicks = 0;
  mental_time = Date.now();
  a_cell = [-1,-1];
  a_id = "";
  var ref_arr = [];
  while (j < 32){
    ref_arr[j] = j + 1;
    ref_arr[64 - j - 1] = j + 1;
    j++;
  }
  var shuf_arr = shuffle_arr(ref_arr);
  console.log(shuf_arr);
  mm = one_to_two_d(shuf_arr);
  console.log(mm);

}

function pause(){
  last_click = Date.now();
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function pause2(){
  ctx6.textAlign = 'start';
  return new Promise(resolve => setTimeout(resolve, 1000));
}


async function cell_click2(idx){
  var this_click = Date.now();
  if (this_click - last_click < 1000){
    return;
  }
  else {
    mental_clicks++;
  }
  var id = idx.id.toString();
  var sp = id.split("c");
  var grids = sp[1].split("x");
  console.log(grids);
  const val = mm[grids[0] - 1][grids[1] - 1];
  if (covered.indexOf(val) != -1){
    return;
  }
  if (a_cell[0] == grids[0] && a_cell[1] == grids[1]){
    return;
  }
  var el = document.getElementById(id);
  var txt = document.getElementById(id).textContent ?? "";
  if (a_id == ""){
    document.getElementById(id).textContent = val.toString();
    document.getElementById(id).style.backgroundColor = colors[val - 1];
    a_id = id;
    a_cell = [grids[0], grids[1]];
  }
  else {
    document.getElementById(id).textContent = val.toString();
    document.getElementById(id).style.backgroundColor = colors[val - 1];
    if (val == mm[a_cell[0] - 1][a_cell[1] - 1]){
      if (covered.indexOf(val) == -1){
        covered.push(val);
      }
    }
    else {
      await pause();
      document.getElementById(id).textContent = "";
      document.getElementById(a_id).textContent = "";
      document.getElementById(id).style.backgroundColor = "white";
      document.getElementById(a_id).style.backgroundColor = "white";
    }
    a_id = "";
    a_cell = [-1,-1];
  }





}
window.cell_click2 = cell_click2;

async function submitMental(){
  console.log(covered);
  if (covered.length == 32){
    console.log('success!');
    const time_taken = Date.now() - mental_time;
    console.log(mental_clicks);
    console.log(time_taken);
  }
  else {
    console.log('incomplete');
  }
}
window.submitMental = submitMental;

async function restartMental(){
  window.location.reload();
}
window.restartMental = restartMental;


// nonogram

function generateNonogram(width, height) {
  const grid = Array(height).fill(0).map(() => Array(width).fill(0));

  function isValid(x, y) {
    // Check rows and columns for validity
    for (let i = 0; i < height; i++) {
      let rowSum = 0;
      for (let j = 0; j < width; j++) {
        rowSum += grid[i][j];
      }
      if (rowSum > width) return false;
    }

    for (let i = 0; i < width; i++) {
      let colSum = 0;
      for (let j = 0; j < height; j++) {
        colSum += grid[j][i];
      }
      if (colSum > height) return false;
    }

    return true;
  }

  function backtrack(x, y) {
    if (y >= grid.length) return true;

    for (let i = 0; i < 2; i++) {
      grid[y][x] = i;

      if (x < grid[0].length - 1) {
        if (backtrack(x + 1, y)) return true;
      } else if (y < grid.length - 1) {
        if (backtrack(0, y + 1)) return true;
      } else {
        return isValid(x, y);
      }
    }

    return false;
  }

  backtrack(0, 0);

  // Randomly set some cells to 1
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (Math.random() < 0.5) {
        grid[i][j] = 1;
      }
    }
  }

  return grid;
}

function generateNonogramClues(grid) {
  const rowClues = [];
  const colClues = [];

  // Generate row clues
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    const blackBlocks = [];
    const whiteBlocks = [];
    let currentBlock = 0;

    for (let j = 0; j < row.length; j++) {
      if (row[j] === 1) {
        currentBlock++;
      } else {
        if (currentBlock > 0) {
          blackBlocks.push(currentBlock);
          currentBlock = 0;
        }
      }
    }

    if (currentBlock > 0) {
      blackBlocks.push(currentBlock);
    }

    rowClues.push(blackBlocks);
  }

  // Generate column clues
  for (let j = 0; j < grid[0].length; j++) {
    const col = [];
    for (let i = 0; i < grid.length; i++) {
      col.push(grid[i][j]);
    }

    const blackBlocks = [];
    const whiteBlocks = [];
    let currentBlock = 0;

    for (let i = 0; i < col.length; i++) {
      if (col[i] === 1) {
        currentBlock++;
      } else {
        if (currentBlock > 0) {
          blackBlocks.push(currentBlock);
          currentBlock = 0;
        }
      }
    }

    if (currentBlock > 0) {
      blackBlocks.push(currentBlock);
    }

    colClues.push(blackBlocks);
  }

  return { rowClues, colClues };
}

async function nono_test(){
  const nonogram = generateNonogram(8, 8);
  console.log(nonogram);
  const clues = generateNonogramClues(nonogram);
  console.log(clues);
}
window.nono_test = nono_test;


async function cell_click3(idx){
  var id = idx.id.toString();
  var sp = id.split("cn");
  var grids = sp[1].split("x");
  nono_clicks++;
  if (nono_cur[grids[0] - 1][grids[1] - 1] == 0){
    nono_cur[grids[0] - 1][grids[1] - 1] = 1;
    document.getElementById(id).style.backgroundColor = "purple";
  }
  else {
    nono_cur[grids[0] - 1][grids[1] - 1] = 0;
    document.getElementById(id).style.backgroundColor = "white";
  }

}
window.cell_click3 = cell_click3;


async function start_game_nono(){
  nono_fin = Array(8).fill().map(() => Array(8).fill(0));
  nono_cur = Array(8).fill().map(() => Array(8).fill(0));
  nono_fin = generateNonogram(8,8);
  nono_clicks = 0;
  nono_time = Date.now();
  const clues = generateNonogramClues(nono_fin);
  r_clues = clues.rowClues;
  c_clues = clues.colClues;

  var k = 0;
  while (k < 9){
    if (k != 0){
      var id = "cn".concat(k.toString()).concat('x0');
      document.getElementById(id).textContent = c_clues[k - 1].toString();
    }
    k++;
  }
  k = 0;
  while (k < 9){
    if (k != 0){
      var id = "cn0x".concat(k.toString());
      document.getElementById(id).textContent = r_clues[k - 1].toString();
    }
    k++;
  }

}

function compareArrays(a, b){
  if (a.length != b.length){
    return false;
  }
  for (var i = 0; i < a.length; i++){
    if (a[i] != b[i]){
      return false;
    }
  }
  return true;
}


async function check_nono(){
  var fin_clues = generateNonogramClues(nono_fin);
  var cur_clues = generateNonogramClues(nono_cur);
  console.log(fin_clues);
  console.log(cur_clues);


  var flag = true;
  for (var i = 0; i < fin_clues.colClues.length; i++) {
    if (!compareArrays(fin_clues.colClues[i], cur_clues.rowClues[i]) || !compareArrays(fin_clues.rowClues[i], cur_clues.colClues[i])){
      flag = false;
      break;
    }
  }
  if (flag){
    console.log('success!');
    const time_taken = Date.now() - nono_time;
    console.log(nono_clicks);
    console.log(time_taken);
  }
  else {
    console.log('incomplete!');
  }

}
window.check_nono = check_nono;

async function restartNono(){
  window.location.reload();
}
window.restartNono = restartNono;




// space rumble

var canvas3 = document.getElementById('game');
var ctx3 = canvas3.getContext('2d');

// Set the canvas dimensions
canvas3.width = 640;
canvas3.height = 480;

// Load the assets
var playerImage = new Image();
playerImage.src = './img/playerbg.png';

if (localStorage.getItem('last_chain') == 'eth'){
  playerImage.src = './img/ethpl.png';
}
else if (localStorage.getItem('last_chain') == 'mnt'){
  playerImage.src = './img/mntpl.png';
}
else if (localStorage.getItem('last_chain') == 'flr'){
  playerImage.src = './img/flrpl.png';
}
else if (localStorage.getItem('last_chain') == 'lsk'){
  playerImage.src = './img/lskpl.png';
}
else if (localStorage.getItem('last_chain') == 'gvt'){
  playerImage.src = './img/gvtpl.png';
}
else if (localStorage.getItem('last_chain') == 'skl'){
  playerImage.src = './img/sklpl.png';
}

const obstacle1Image = new Image();
obstacle1Image.src = './img/obstacle1bg.png';

const obstacle2Image = new Image();
obstacle2Image.src = './img/obstacle2bg.png';

var expImage = new Image();
expImage.src = './img/ethlog2.png';

// Define the game variables
var usize = 60;
if (window.innerHeight < 725){
  usize = 40;
}
var playerX = 10;
var playerY = canvas3.height/2;
let playerSpeed = 25;

var obstacles = [];
var obstacleSpeed = 4;


var scoreRun = 0;
var scoreRec = 0;
var pendingScoreRun = false;

var stars = [];
var ongoingRun = false;

var lastExp = Date.now();
var expOn = false;
var exps = [];
var expSpeed = 7;

var freq;
var lastLoop = 0;

var armorOn = false;
var armorStart = 0;
var armorLeft = 1;
var armorLevel = 1000;


function clearScreen2(){

  ctx3.fillStyle= 'rgb(0,0,60)';// make screen nightsky
  ctx3.fillRect(0,0,canvas3.clientWidth,canvas3.clientHeight)// nightskylike color start from 0px left, right to canvas width and canvas height
  ctx3.fillStyle = 'white';
  if (stars.length == 0){
    for (let i = 0; i < 200; i++){
      const x = Math.floor(Math.random() * canvas3.width);
      const y = Math.floor(Math.random() * canvas3.height);
      ctx3.beginPath();
      ctx3.arc(x, y, 1, 0, 2 * Math.PI);
      ctx3.fill();
      stars.push([x, y]);
    }

  }
  else {
    for (let i = 0; i < stars.length; i++){
      const x = stars[i][0] - 1;
      stars[i][0] = x;
      const y = stars[i][1];
      ctx3.beginPath();
      ctx3.arc(x, y, 1, 0, 2 * Math.PI);
      ctx3.fill();

    }
    var r = Math.floor(Math.random() * 10);
    if (r > 5){
      const new_y = Math.floor(Math.random() * canvas3.height);
      stars.push([canvas3.width, new_y]);
    }

    stars = stars.filter((entry) => entry[0] >= 0);

  }



}

function checkCollisionRun(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2) {
    return true;
  } else {
    return false;
  }
}


async function setupRun() {
  // Clear the canvas
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  clearScreen2();
  // Draw the player

  ctx3.drawImage(playerImage, 0, 0, playerImage.width, playerImage.height, playerX, playerY, Math.floor(3*usize/2), usize);





}
window.setupRun = setupRun;

async function preloadRun(){
  if (ongoingRun){
    return;
  }
  else {
    ongoingRun = true;
    const getFPS = () =>
    new Promise(resolve =>
      requestAnimationFrame(t1 =>
        requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
      )
    )

  // Calling the function to get the FPS
  freq = await getFPS();
  console.log(freq);
  if (freq > 154){
    freq = 300;
  }
  if (Math.abs(144 - freq) < 10){
    freq = 144;
  }
  else if (Math.abs(120 - freq) < 10){
    freq = 120;
  }
  else if (Math.abs(100 - freq) < 10){
    freq = 100;
  }
  else if (Math.abs(85 - freq) < 10){
    freq = 85;
  }
  else {
    freq = 60;
  }


  console.log(freq);
  pendingScoreRun = false;
    await reloadRun();
  }
}
window.preloadRun = preloadRun;



async function reloadRun() {
  var tn = performance.now();
  if (tn - lastLoop >= 15.9){
    // Clear the canvas
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    clearScreen2();
    // Draw the player
    ctx3.drawImage(playerImage, 0, 0, playerImage.width, playerImage.height, playerX, playerY, Math.floor(3*usize/2), usize);
    if (Date.now() - armorStart >= 3000){
      armorOn = false;
    }
    if (armorOn){
      ctx3.fillStyle = 'rgb(255,255,0, 0.3)';
      //ctx3.fillRect(playerX,playerY,70, 50);
      ctx3.beginPath();
      ctx3.ellipse(playerX + usize/2 + 10, playerY + usize/2, usize, usize/2, 0, 0,  2 * Math.PI);
      ctx3.fill();
    }

    // Update the obstacles
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].x -= obstacleSpeed;

      // Draw the obstacle
      ctx3.drawImage(obstacles[i].image, 0, 0, obstacles[i].image.width, obstacles[i].image.height, obstacles[i].x, obstacles[i].y, usize, usize);

      if (obstacles[i].x <= Math.floor(usize*3/2) && Math.abs(playerY - obstacles[i].y) <= 100){
        ctx3.fillStyle = 'rgb(255,0,0, 0.3)';
        ctx3.beginPath();
        ctx3.roundRect(obstacles[i].x - 5, obstacles[i].y, usize + 10, usize, 20);
        ctx3.strokeStyle = 'rgb(255,0,0, 0.2)';
        ctx3.stroke();
        //ctx3.ellipse(obstacles[i].x + 30, obstacles[i].y + 30, 37, 37, 0, 0,  2 * Math.PI);
        ctx3.fill();
        if (!armorOn){
          ctx3.fillStyle = 'rgb(255,0,0, 0.2)';
          //ctx3.fillRect(playerX,playerY,70, 50);
          ctx3.beginPath();
          ctx3.roundRect(playerX - 5, playerY, usize*1.6 + 2, usize, 20);
          ctx3.strokeStyle = 'rgb(255,0,0, 0.2)';
          ctx3.stroke();
          ctx3.fill();
        }
      }

      // Check for collision with the player
      if (checkCollisionRun(playerX, playerY, usize, usize, obstacles[i].x, obstacles[i].y, usize, usize)) {
        if (armorOn){
          continue;
        }
        else {
          // Game over
          ctx3.fillStyle = 'black';
          ctx3.globalAlpha = 0.75;
          if (usize == 40){
            ctx3.fillRect(0, canvas3.height / 2 - usize/2, canvas3.width, usize + 30);
          }
          else {
            ctx3.fillRect(0, canvas3.height / 2 - usize/2, canvas3.width, usize + 20);
          }


          ctx3.globalAlpha = 1;
          ctx3.fillStyle = 'white';
          ctx3.font = '32px monospace';
          if (usize == 40){
            ctx3.font = '28px monospace';
          }
          ctx3.textAlign = 'center';
          ctx3.textBaseline = 'middle';
          ctx3.fillText('GAME OVER! Your score is '.concat(scoreRun.toString()), canvas3.width / 2, canvas3.height / 2);
          ctx3.font = '28px monospace';
          if (usize == 40){
            ctx3.font = '24px monospace';
          }
          const acc = localStorage.getItem('acc');
          const cn = localStorage.getItem('last_chain');
          if (acc == null || acc == "" || cn == "" || cn == null){
            ctx3.fillText('Thank you for playing Space Rumble', canvas3.width / 2, canvas3.height / 2 + 30);
          }
          else {
            let ss = await checkIfHighscore(scoreRun, 1);
            if (ss){
               ctx3.fillText('New High Score! Click ENTER to record.', canvas3.width / 2, canvas3.height / 2 + 30);

            }
            else {
               ctx3.fillText('Click ENTER to record your score On-Chain', canvas3.width / 2, canvas3.height / 2 + 30);

            }
          }

          obstacles = [];
          scoreRec = scoreRun;
          scoreRun = 0;
          exps = [];
          expOn = false;
          lastExp = Date.now();
          armorOn = false;
          armorStart = 0;
          armorLeft = 1;
          armorLevel = 1000;
          ongoingRun = false;
          pendingScoreRun = true;
          return;
        }

      }

      // Remove the obstacle if it's off the screen
      if (obstacles[i].x < -obstacles[i].image.width) {
        obstacles.splice(i, 1);
      }
    }

    // Add new obstacles
    var yObst = Math.floor(Math.random() * (canvas3.height - usize));
    var zone_prev = 0;
    var zone_new = 1;
    var strikes = 0;
    const band = canvas3.height/3;


    if (Math.random() < 0.035) {
      const obstacleImage = Math.random() < 0.5 ? obstacle1Image : obstacle2Image;
      if (yObst > 2*band){
        yObst = Math.floor(Math.random() * (band));
        zone_new = 1;
      }
      else if (yObst <= 2*band && yObst > band){
        yObst = Math.floor(Math.random() * (band - usize) + 2*band);
        zone_new = 2;
      }
      else {
        yObst = Math.floor(Math.random() * (band - usize) + band);
        zone_new = 3;
      }

      if (zone_new != zone_prev){
        obstacles.push({ x: canvas3.width, y: yObst, image: obstacleImage });
        zone_prev = zone_new;
      }
      else {
        strikes++;
        if (strikes == 3){
          strikes = 0;
          zone_prev = 0;
        }

      }

    }

    // Update the exps
    for (let i = 0; i < exps.length; i++) {
      exps[i].x -= expSpeed;

      // Draw the exp
      ctx3.fillStyle = 'rgba(170,170,170,0.7)';
      ctx3.fillRect(exps[i].x, exps[i].y,usize,usize);
      ctx3.drawImage(exps[i].image, 0, 0, exps[i].image.width, exps[i].image.height, exps[i].x, exps[i].y, usize, usize);



      // Remove the exp if it's off the screen
      if (exps[i].x < -exps[i].image.width) {
        exps.splice(i, 1);
      }

      // Check if the player received the incoming exp
      else if (checkCollisionRun(playerX, playerY, usize, usize, exps[i].x, exps[i].y, usize, usize)) {
        expOn = true;
        exps.splice(i, 1);
      }
      else {}
    }

    // add ExpUp


    var chain_name = localStorage.getItem('last_chain');

    if (chain_name == 'mnt'){
      expImage.src = './img/mntlog.png';
    }
    else if (chain_name == 'gvt'){
      expImage.src = './img/gvtlog.png';
    }
    else if (chain_name == 'lsk'){
      expImage.src = './img/lsklog.png';
    }
    else if (chain_name == 'flr'){
      expImage.src = './img/flrlog.png';
    }
    else if (chain_name == 'skl'){
      expImage.src = './img/skllog.png';
    }
    else if (chain_name == 'eth'){
      expImage.src = './img/ethlog2.png';
    }

    if (Date.now() - lastExp >= 20000){
      lastExp = Date.now();
      const yExp = Math.floor(Math.random()*(canvas3.height - usize));
      exps.push({ x: canvas3.width, y: yExp, image: expImage });
    }


    // Update the score
    if (expOn){
      scoreRun = scoreRun + 500;
      expOn = false;
    }
    else {
      scoreRun = scoreRun + 1;
    }

    // Update the armor
    if (scoreRun >= armorLevel && armorLeft < 9){
      armorLeft++;
      armorLevel = armorLevel * 2.5;
    }


    // Draw the score
    ctx3.font = '20px Arial';
    ctx3.fillStyle = '#cccccc';
    ctx3.textAlign = 'left';
    ctx3.textBaseline = 'top';
    ctx3.fillText('Score: ' + scoreRun, 10, 10);
    ctx3.fillText('Armor: ' + armorLeft, canvas3.width - 95, 10);
    lastLoop = tn;
  }



  requestAnimationFrame(reloadRun);


}
window.reloadRun = reloadRun;

function restartRun(){

    window.location.reload();
}
window.restartRun = restartRun;


// tile gusta

var canvas4 = document.getElementById('game');
var ctx4 = canvas4.getContext('2d');

// Set the canvas dimensions
canvas4.width = 640;
canvas4.height = 480;

var gridTilegusta = 32;
if (window.innerHeight < 725){
  gridTilegusta = 24;
}
const tetrominoSequence = [];

// keep track of what is in every cell of the game using a 2d array
// tilegusta playfield is 10x20, with a few rows offscreen
const playfield = [];

// populate the empty state
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

// how to draw each tetromino
const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

// color of each tetromino
const colorsTilegusta = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};

var countTilegusta = 0;
var tetromino = getNextTetromino();
var rAF = null;  // keep track of the animation frame so we can cancel it
var gameOverTilegusta = false;
var scoreTilegusta = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// generate a new tetromino sequence
function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}


// get the next tetromino in the sequence
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];

  // I and O start centered, all others start in left-middle
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  // I starts on row 21 (-1), all others start on row 22 (-2)
  const row = name === 'I' ? -1 : -2;

  return {
    name: name,      // name of the piece (L, O, etc.)
    matrix: matrix,  // the current rotation matrix
    row: row,        // current row (starts offscreen)
    col: col         // current col
  };
}



// rotate an NxN matrix 90deg
// @see https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}

// check to see if the new matrix/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          // outside the game bounds
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // collides with another piece
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }

  return true;
}



// place the tetromino on the playfield
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {

        // game over if piece has any part offscreen
        if (tetromino.row + row < 0) {
          return showGameOver();
        }
        else {
          scoreTilegusta++;
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // check for line clears starting from the bottom and working our way up
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {

      // drop every row above this one
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
      }
      scoreTilegusta += 10;
    }
    else {
      row--;
    }
  }

  tetromino = getNextTetromino();
}


// show the game over screen
async function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOverTilegusta = true;

  ctx4.fillStyle = 'black';
  ctx4.globalAlpha = 0.75;
  ctx4.fillRect(0, canvas4.height / 2 - 30, canvas4.width, 120);

  ctx4.globalAlpha = 1;
  ctx4.fillStyle = 'white';
  if (gridTilegusta == 24){
    ctx4.font = '14px monospace';
  }
  else {
    ctx4.font = '16px monospace';
  }
  ctx4.textAlign = 'center';
  ctx4.textBaseline = 'middle';
  ctx4.fillText('GAME OVER! Your score is '.concat(scoreTilegusta.toString()), canvas4.width / 2, canvas4.height / 2);
  const acc = localStorage.getItem('acc');
  const cn = localStorage.getItem('last_chain');
  if (acc == null || acc == "" || cn == "" || cn == null){
    ctx4.fillText('Thank you for playing', canvas4.width / 2, canvas4.height / 2 + 30);
    ctx4.fillText('our Tile Gusta Game', canvas4.width / 2, canvas4.height / 2 + 60);
  }
  else {
    let ss = await checkIfHighscore(scoreTilegusta, 2);
    if (ss){
      ctx4.fillText('New High Score!', canvas4.width / 2, canvas4.height / 2 + 30);
      ctx4.fillText('Click ENTER to record.', canvas4.width / 2, canvas4.height / 2 + 60);
    }
    else {
      ctx4.fillText('Click ENTER to record your', canvas4.width / 2, canvas4.height / 2 + 30);
      ctx4.fillText('score On-Chain', canvas4.width / 2, canvas4.height / 2 + 60);
    }

  }

}


function clearScreen4(){
  ctx4.fillStyle = 'pink';
  ctx4.fillRect(0, 0, canvas4.width, canvas4.height);
  // Draw the score
  if (gridTilegusta == 24){
    ctx4.font = '18px Arial';
  }
  else {
    ctx4.font = '24px Arial';
  }
  ctx4.fillStyle = 'purple';
  ctx4.textAlign = 'left';
  ctx4.textBaseline = 'top';
  ctx4.fillText('Score: ' + scoreTilegusta, 10, 10);
}


// game loop
function loop() {
  rAF = requestAnimationFrame(loop);
  ctx4.clearRect(0,0,canvas4.width,canvas4.height);
  clearScreen4();

  // draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        ctx4.shadowColor = 'grey';
        ctx4.shadowBlur = 2;
        ctx4.shadowOffsetX = 1;
        ctx4.shadowOffsetY = 1;
        ctx4.fillStyle = colorsTilegusta[name];

        // drawing 1 px smaller than the grid creates a grid effect
        ctx4.fillRect(col * gridTilegusta, row * gridTilegusta, gridTilegusta-1, gridTilegusta-1);
        ctx4.strokeStyle = 'pink';
        ctx4.strokeRect(col * gridTilegusta, row * gridTilegusta, gridTilegusta-1, gridTilegusta-1);
      }
    }
  }

  // draw the active tetromino
  if (tetromino) {

    // tetromino falls every 35 frames
    if (++countTilegusta > 35) {
      tetromino.row++;
      countTilegusta = 0;

      // place piece if it runs into anything
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    ctx4.fillStyle = colorsTilegusta[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // drawing 1 px smaller than the grid creates a grid effect
          ctx4.fillRect((tetromino.col + col) * gridTilegusta, (tetromino.row + row) * gridTilegusta, gridTilegusta-1, gridTilegusta-1);
        }
      }
    }
  }
}



async function reloadTilegusta(){
  rAF = requestAnimationFrame(loop);
}
window.reloadTilegusta = reloadTilegusta;



async function restartTilegusta(){
  window.location.reload();
}
window.restartTilegusta = restartTilegusta;

// flapperoo

var canvas6 = document.getElementById('game');
var ctx6 = canvas6.getContext('2d');

// Set the canvas dimensions
canvas6.width = 400;
canvas6.height = 600;

let gridFlap = 50;
if (window.innerHeight < 725){
  gridFlap = 37;
}

var margin = 0;
  if (gridFlap == 37){
    margin = 5;
  }

// Game constants
const GRAVITY = 0.04;
const FLAP = -1;
const BIRD_WIDTH = 50 * gridFlap / 50;
const BIRD_HEIGHT = 50 * gridFlap / 50;
const PIPE_WIDTH = (70 * gridFlap) / 50;
const PIPE_GAP = (100 * gridFlap) / 50; // Gap size just enough for the bird
const PIPE_SPEED = 1;
const PIPE_SPACING = (350 * gridFlap) / 50;

var img_brd = new Image();
img_brd.src = './img/flapup.svg';

// Game state
let bird = {
    x: (100 * gridFlap)/50,
    y: canvas6.height / 2,
    velocity: 0,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT
};
let pipes = [];
let gameOverFlap = false;
let scoreFlap = 0;
let rafFlap = null;
let seedFlap = 0;

let gameOngoingFlap = false;
let lastEndFlap = 0;

// Pipe constructor
function createPipe() {
    const minHeight = (100 * gridFlap) / 50; // Minimum pipe height to ensure gap is on canvas
    const maxHeight = canvas6.height - PIPE_GAP - minHeight;
    const gapY = Math.random() * (maxHeight - minHeight) + minHeight + Math.random() * 40;
    return {
        x: canvas6.width,
        gapY: gapY,
        width: PIPE_WIDTH,
        passed: false // Track if bird has passed this pipe for scoring
    };
}



// Collision detection
function checkCollisionFlap() {
    for (let pipe of pipes) {
        // Check collision with top pipe (from canvas top to gapY - PIPE_GAP)
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y + margin < pipe.gapY - PIPE_GAP || bird.y + bird.height > pipe.gapY + margin)
        ) {
            return true;
        }
    }

    // Check if bird hits the ground or ceiling
    if (bird.y + bird.height > canvas6.height + margin || bird.y + margin < 0) {
        return true;
    }
    return false;
}

// Update game state
function updateFlap() {
  console.log(bird.velocity);
    if (gameOverFlap) return;

    // Update bird
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Generate pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas6.width - PIPE_SPACING) {
        pipes.push(createPipe());
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;

        // Score when bird passes pipe
        if (!pipes[i].passed && bird.x > pipes[i].x + pipes[i].width) {
            scoreFlap++;
            pipes[i].passed = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }
    }

    // Check for collisions
    if (checkCollisionFlap()) {
        gameOverFlap = true;
    }
}



// Render game
async function drawFlap() {
    // Clear canvas
    ctx6.fillStyle = '#87CEEB'; // Sky blue background
    ctx6.fillRect(0, 0, canvas6.width, canvas6.height);

    // Draw bird
    if (seedFlap % 25 == 0){
      img_brd.src = "./img/flapup.svg";
      console.log(seedFlap);
    }
    else {
      img_brd.src = "./img/flapdown.svg";
    }


    ctx6.drawImage(img_brd, bird.x, bird.y, bird.width, bird.height);

    //ctx6.fillStyle = 'yellow';
    //ctx6.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes

    for (let pipe of pipes) {
        ctx6.fillStyle = 'green';
        // Top pipe (from top to gapY - PIPE_GAP)
        ctx6.fillRect(pipe.x, 0, pipe.width, pipe.gapY - PIPE_GAP);
        // Bottom pipe (from gapY to canvas bottom)
        ctx6.fillRect(pipe.x, pipe.gapY, pipe.width, canvas6.height - pipe.gapY);

        console.log(pipe.gapY - PIPE_GAP);
        ctx6.fillStyle = '#004400';
        ctx6.fillRect(pipe.x - 5, pipe.gapY, pipe.width + 10, 10);
        ctx6.fillRect(pipe.x - 5, pipe.gapY - PIPE_GAP - 10, pipe.width + 10, 10);
    }

    // Draw score
    if (!gameOverFlap){
      ctx6.fillStyle = 'black';
      if (gridFlap == 50){
        ctx6.font = '20px Arial';
      }
      else {
        ctx6.font = '18px Arial';
      }

      ctx6.fillText(`Score: ${scoreFlap}`, 10, 30);
    }


    // Draw game over message
    if (gameOverFlap) {
      if (rafFlap !== null){
        cancelAnimationFrame(rafFlap);
        rafFlap = null;
      }
      lastEndFlap = Date.now();
      ctx6.fillStyle = 'black';
      ctx6.globalAlpha = 0.75;
      ctx6.fillRect(0, canvas6.height / 2 - 30, canvas6.width, 120);

      ctx6.globalAlpha = 1;
      ctx6.fillStyle = 'white';
      if (gridFlap == 25){
        ctx6.font = '14px monospace';
      }
      else {
        ctx6.font = '16px monospace';
      }
      ctx6.textAlign = 'center';
      ctx6.textBaseline = 'middle';
      ctx6.fillText('GAME OVER! Your score is '.concat(scoreFlap.toString()), canvas6.width / 2, canvas6.height / 2);

      const acc = localStorage.getItem('acc');
      const cn = localStorage.getItem('last_chain');
      if (acc == null || acc == "" || cn == "" || cn == null){
        ctx6.fillText('Thank you for playing', canvas6.width / 2, canvas6.height / 2 + 30);
        ctx6.fillText('our Flapperoo Game', canvas6.width / 2, canvas6.height / 2 + 60);
      }
      else {
        let ss = await checkIfHighscore(scoreFlap, 3);
        ctx6.textAlign = 'center';
        if (ss){
          ctx6.fillText('New High Score!', canvas6.width / 2, canvas6.height / 2 + 30);
          ctx6.fillText('Click ENTER to record.', canvas6.width / 2, canvas6.height / 2 + 60);
        }
        else {
          ctx6.fillText('Click ENTER to record your', canvas6.width / 2, canvas6.height / 2 + 30);
          ctx6.fillText('score On-Chain', canvas6.width / 2, canvas6.height / 2 + 60);
        }
        await pause2();
      }

        gameOngoingFlap = false;
    }
    else {
      seedFlap++;
    }
}


// Game loop
function gameLoopFlap() {
    if (!gameOverFlap) {
        updateFlap();
    }
    else {
      cancelAnimationFrame(rafFlap);
      ctx6.textAlign = 'start';
      return;
    }

    cancelAnimationFrame(rafFlap);
    drawFlap();
    rafFlap = requestAnimationFrame(gameLoopFlap);
}


async function reloadFlap(){
  if (gameOngoingFlap || (Date.now() - lastEndFlap < 2000)){
    return;
  }
  bird.y = canvas6.height / 2;
  bird.velocity = 0;
  pipes = [];
  scoreFlap = 0;
  gameOverFlap = false;
  gameOngoingFlap = true;
  gameLoopFlap();
}
window.reloadFlap = reloadFlap;



async function restartFlap(){
  window.location.reload();
}
window.restartFlap = restartFlap;




// common

async function to_wp(){
  window.open('https://docs.google.com/document/d/1QllAptTCUifm2BWRoMr8lhODAeokwHTPDXP5lr6IN5U/edit?usp=sharing', '_blank');
}
window.to_wp = to_wp;

async function to_gh(){
  window.open('https://github.com/darksunlabs', '_blank');
}
window.to_gh = to_gh;

async function to_medium(){
  window.open('https://darksunlabs.medium.com', '_blank');
}
window.to_medium = to_medium;

async function to_discord(){
  window.open('https://discord.com/invite/UgRnPt639K', '_blank');
}
window.to_discord = to_discord;

async function to_rules(){
  var url = window.location.toString();
  var game_name = url.substring(url.indexOf('?') + 1);
  window.open('./info.html?'.concat(game_name), '_blank');
}
window.to_rules = to_rules;


async function load_rules(){
  var url = window.location.toString();
  var game_name = url.substring(url.indexOf('?') + 1);
  var el = document.getElementById('game_info');
  var el2 = document.getElementById("game_title");
  if (game_name == 'pixelmayhem'){
    el2.textContent = 'Pixel Mayhem';
    el.innerHTML = `
        <p style="font-size: 2em;">Are you confident of your laser focus?</p>
        <p style="font-size: 1.6em;">Play Pixel Mayhem and recreate the canvas on the left EXACTLY as it is on your canvas on the right.</p>
        <p style="font-size: 1.6em;">Do this in lesser time than your competing players to win Pixel Mayhem.</p>
    `;
  }
  else if (game_name == 'snake'){
    el2.textContent = "Good Ol' Snake";
    el.innerHTML = `
        <p style="font-size: 2em;">Snake is back! This time on Web 3!</p>
        <p style="font-size: 1.6em;">The iconic Snake Game is back to make you relive your childhood. Move the Snake with Up, Down, Left, Right keys on your Keyboard. The Snake gets longer with each bug it eats. It dies if it touches the boundary or itself (not meant to sound wrong but it probably does).</p>
        <p style="font-size: 1.6em;">Start the game by pressing the Up, Down, Left, or Right key.</p>
    `;
  }
  else if (game_name == 'nonogram'){
    el2.textContent = 'Nonogram';
    el.innerHTML = `
        <p style="font-size: 2em;">The widely popular Nonogram is now LIVE on your favorite chains!</p>
        <p style="font-size: 1.6em;">The goal is to fill the boxes in the grid as per the hints given next to the columns and rows. You're also being timed so you need to be correct, but also quicker than your competing players.</p>
        <p style="font-size: 1.6em;">For example, a [3, 1, 1] next to a row means three consecutive blocks are to be shaded, then a couple of single blocks away from it, and one another as well.</p>
        <p style="font-size: 1.6em;"> Usually, each Nonogram has 1 UNIQUE solution, but if you're confident yours is correct but not unique, we count it too!</p>
    `;
  }
  else if (game_name == 'monumental'){
    el2.textContent = 'Monu-Mental';
    el.innerHTML = `
        <p style="font-size: 2em;">The Mental Game is for you if you flex a Photographic Memory</p>
        <p style="font-size: 1.6em;">The goal is to highlight two boxes with the same symbol and color inside them.  </p>
        <p style="font-size: 1.6em;">Click two matching symbols and they remain visible, but if they don't match, they hide back! Make every box in the grid visible to complete Monu-Mental. You're also being timed so make sure to be quicker than your competing players!</p>

    `;
  }
  else if (game_name == 'spacerumble'){
    el2.textContent = 'Space Rumble';
    el.innerHTML = `
        <p style="font-size: 2em;color: #cccccc;font-family: monospace">A Sort of Variation of Space Impact from Our Black and White Phone Days</p>
        <p style="font-size: 1.6em;color: #cccccc;font-family: monospace">Can you help Space Doggo navigate through space dodging the scary asteroids?  </p>
        <p style="font-size: 1.6em;color: #cccccc;font-family: monospace">Move him up and down the screen to avoid getting hit. Remember, asteroids can destabilize the spacetime around the ship without touching it so try to not be TOO CLOSE. The red zone around the asteroid and your ship becomes visible when you're flying dangerously close. DO NOT let these fields overlap or it is game over. There is always 'at least' one place safe on the screen and it is advised to remain close to the center to have access to that spot at all times.</p>
        <p style="font-size: 1.6em;color: #cccccc;font-family: monospace">Try to get the EXP powerups that whizz past. They appear every 20 seconds. You also have an armor that makes you invincible for 3 seconds. You can activate it with the Left key, but don't rely on it too much: it gets rarer as your score goes higher.</p>
        <p style="font-size: 1.6em;color: #cccccc;font-family: monospace">The highest score at the time of competition close wins!</p>

    `;
  }
  else if (game_name == 'tilegusta'){
    el2.textContent = 'Tile Gusta';
    el.innerHTML = `
        <p style="font-size: 1.9em;color: #cccccc;font-family: monospace;margin-bottom: -3px">The Iconic Classic Game is back to remind you of the Good Ol' Days</p>
        <p style="font-size: 1.5em;color: #cccccc;font-family: monospace">Accommodate as many blocks on the canvas as you can before they overflow.  </p>
        <p style="font-size: 1.5em;color: #cccccc;font-family: monospace">Completely filled horizontal rows disappear, leaving you with more room to work with.</p>
        <p style="font-size: 1.5em;color: #cccccc;font-family: monospace">The highest score at the time of competition close wins!</p>

    `;
  }
  else if (game_name == 'flapperoo'){
    el2.textContent = 'Flapperoo';
    el.innerHTML = `
        <p style="font-size: 1.9em;color: #cccccc;font-family: monospace; margin-bottom: -3px">This simple yet elegant masterpiece is back in a Web 3 avatar!</p>
        <p style="font-size: 1.5em;color: #cccccc;font-family: monospace">Can you keep Flapperoo the bird safe in his flight through the pipes?  </p>
        <p style="font-size: 1.5em;color: #cccccc;font-family: monospace">Use the UP button for the upward flight motion, and the LEFT button for going quicker.</p>
        <p style="font-size: 1.5em;color: #cccccc;font-family: monospace">The highest score at the time of competition close wins!</p>

    `;
  }
  else {
    el2.textContent = 'Game Not Found';
    document.getElementById('now_tagline').style.display = 'none';
    el.innerHTML = `
        <p style="font-size: 2em;">This link is broken</p>

        <p style="font-size: 1.6em;">Are you sure the selected game exists? </p>

    `;
  }
  el.style.marginLeft = "3%";
  el.style.marginRight = "3%";
}
window.load_rules = load_rules;




async function back_to_game(){
  var url = window.location.toString();
  var game_name = url.substring(url.indexOf('?') + 1);
  window.location.href = './launch.html?'.concat(game_name);
}
window.back_to_game = back_to_game;

async function to_games(){
  window.location.href = './games.html';
}
window.to_games = to_games;

async function load_games(){
  const acc = localStorage.getItem('acc');
  const cn = localStorage.getItem('last_chain');
  const warn = localStorage.getItem('warn_once');
  if ((acc == null || acc == "" || cn == "" || cn == null) && (warn == 'n')){
    localStorage.setItem('warn_once', 'y');
    alert('You are not logged in to your Metamask. Please Login now if you want to store your score On-Chain. You can play without logging in, though. Also, please note that we currently only support PCs for playing and you can only have one tab with the game running (to discourage automated parallel game farming).');
  }
  else {
    alert('Welcome to Megusta games. Please note: \n 1. Our games are optimized for PCs only for now \n 2. Only one game session is allowed in the browser tabs (to discourage automated parallel game farming).');
  }
}
window.load_games = load_games;


//add event listener to our body
 //document.body.addEventListener('keydown', keyDown);

 document.body.addEventListener('keydown', async (e) => {

  const key = e.key;
  const code = e.code;
  //console.log(`keydown key: ${key}, code: ${code}`);

  var url = window.location.toString();
  var game_name = url.substring(url.indexOf('?') + 1);

  const sId = localStorage.getItem('session_id');
  if (sId != sessionId){
    return;
  }

  if (game_name == "snake"){
    //up
    if(e.code=="ArrowUp"){
      //prevent snake from moving in opposite direcction
        if(yvelocity==1)
        return;
        yvelocity=-1;
        xvelocity=0;
        dir="up";

    }
    //down
    if(e.code=="ArrowDown"){
        if(yvelocity==-1)
        return;
        yvelocity=1;
        xvelocity=0;
        dir="down";
    }

    //left
    if(e.code=="ArrowLeft"){
        if(xvelocity==1)
        return;
        yvelocity=0;
        xvelocity=-1;
        dir="left";
    }
    //right
    if(e.code=="ArrowRight"){
        if(xvelocity==-1)
        return;
        yvelocity=0;
        xvelocity=1;
        dir="right";
    }
  }
  else if (game_name == "spacerumble"){
      var usize = 60;
      if (window.innerHeight < 725){
        usize = 40;
      }
      if (e.code == "ArrowUp"){
        if (playerY < playerSpeed){
          playerY = 0;
        }
        else {
          playerY = playerY - playerSpeed;
        }

      }
      if (e.code == "ArrowDown"){
        if (playerY + playerSpeed > canvas3.height - usize){
          playerY = canvas3.height - usize;
        }
        else {
          playerY = playerY + playerSpeed;
        }
      }
      if (e.code == "ArrowLeft"){
        if (armorLeft >= 1 && !armorOn){
          armorOn = true;
          armorStart = Date.now();
          armorLeft = armorLeft - 1;
        }
      }
      if (e.code == "Enter"){
        if (pendingScoreRun){
          const acc = localStorage.getItem('acc');
          const cn = localStorage.getItem('last_chain');
          if (acc == null || acc == "" || cn == "" || cn == null){}
          else {
            await registerScore(scoreRec, 1);

          }
        }
      }
  }
  else if (game_name == "tilegusta"){
    if (e.code == "ArrowLeft"){
      const col = tetromino.col - 1;
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }
    else if (e.code == "ArrowRight"){
      const col = tetromino.col + 1;
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }
    else if (e.code == "ArrowUp"){
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }
    else if (e.code == "ArrowDown"){
      const row = tetromino.row + 1;

      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;

        placeTetromino();
        return;
      }

      tetromino.row = row;
      }
    else if (e.code == "Enter"){
        if (gameOverTilegusta){
          const acc = localStorage.getItem('acc');
          const cn = localStorage.getItem('last_chain');
          if (acc == null || acc == "" || cn == "" || cn == null){}
          else {
            await registerScore(scoreTilegusta, 2);
          }

        }
      }

    else {}
  }
  else if (game_name == "flapperoo"){

    if (e.code == "ArrowUp" && !gameOverFlap){

      bird.velocity = FLAP;
    }
    else if (e.code == "ArrowLeft" && !gameOverFlap){

      bird.velocity = FLAP * 2;
    }
    else if (e.code == "Enter"){
        if (gameOverFlap){
          const acc = localStorage.getItem('acc');
          const cn = localStorage.getItem('last_chain');
          if (acc == null || acc == "" || cn == "" || cn == null){}
          else {
            await registerScore(scoreFlap, 3);
          }

        }
      }
  }



});


async function choose_chain(){
    const cname = document.getElementById('chain_name').value;
    console.log(cname);
    localStorage.setItem('chain_meg', cname);
}
window.choose_chain = choose_chain;


async function loadHome(){
    const w = window.innerWidth;
    if (w < 1000){
      document.getElementById('nright').style.display = 'none';
      document.getElementById('gli').style.display = 'none';

    };
    console.log(w);
    localStorage.setItem('session_id', '0');
    localStorage.setItem('warn_once','n');
    var c = localStorage.getItem('last_chain');
    var ts = localStorage.getItem('last_session');
    const tnow = Date.now();
    if (c == null || ts == null){
      localStorage.setItem('last_chain', 'eth');
      localStorage.setItem('last_session', tnow.toString());
      localStorage.setItem('acc', '');
    }
    else if (parseInt(tnow) - parseInt(ts) > 6000000){
      localStorage.setItem('last_session', tnow.toString());
      localStorage.setItem('acc', '');
    }
    c = localStorage.getItem('last_chain');
    var acc = localStorage.getItem('acc');
    console.log(acc);
   if (acc == null || acc == ''){
      return;
    }
    else {
      document.getElementById('nright').innerHTML = `
        <a>`.concat(acc.slice(0,10).concat('...')).concat(`</a>
        <a style="color: black; background-color: #ff6600; cursor: pointer; border-radius: 5%;padding: 1%; padding-bottom: 2%" onclick='logout();'>logout</a>
      `);

    }
    try{
      const res = await axios.post("https://gm-serve3.onrender.com/api/megustacampaign/all", {
        data: null,
      });
    }
    catch(err){
      console.log(err);
    }


}
window.loadHome = loadHome;

async function logout(){
  localStorage.setItem('last_chain', null);
  localStorage.setItem('last_session', null);
  localStorage.setItem('acc', '');
  document.getElementById('nright').innerHTML = `
    <select name="typc" id="chain_name" style="width: 60%;font-size: 1.4em;padding-top: 3%;padding-bottom: 1%;">
        <option value="current">Select Chain</option>
        <option value="eth">Ethereum</option>
        <option value="mnt">Mantle</option>
        <option value="lsk">Lisk</option>
        <option value="flr">Flare</option>
        <option value="gvt">Gravity</option>
        <option value="skl">Skale</option>


    </select>
    <img src="img/wallet-icon.svg" alt="Wallet" class="wallet-icon" onclick="connect();">
  `;
}
window.logout = logout;

async function to_faq(){
  window.location.href = './faqs.html';
}
window.to_faq = to_faq;

async function to_scores(){
  window.open('./scores.html', '_blank');
}
window.to_scores = to_scores;

async function load_scores(){
  const acc = localStorage.getItem('acc');
  const chn = localStorage.getItem('last_chain');

  if (acc == null || chn == null || acc == "" || chn == ""){
    document.getElementById('featured-games').innerHTML = `
      <p style="font-size: 1.4em;">You are not logged in. Please log in with Metamask and choose a chain.</p>
      <p>If this is not the case, please contact our support.</p>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    `;
    return;
  }
  await getMyScore();
  await getTopScore();
}
window.load_scores = load_scores;

async function face_adjust(){
  const el = document.getElementById('hc');
  if (el.style.visibility == 'hidden'){
    el.style.visibility = 'visible';
  }
  else {
    el.style.visibility = 'hidden';
  }
}
window.face_adjust = face_adjust;


async function registerScore(scr, gid){
    try{
      const res = await axios.post("https://gm-serve3.onrender.com/api/megustacampaign/all", {
        data: null,
      });
    }
    catch(err){
      console.log(err);
    }
    const web3 = new Web3(window.ethereum);
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    var abiInstance;
    var contract;
    var tol = 100;

    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xdbd0b45076a748270e62d5378c233981db78d581");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
        

    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");


    }
    else {
        console.log('unknown chain');
        return;
    }

  var gasEst = BigInt(100000);
  var gasPriceEst = BigInt(10);

  try {
    gasEst = await contract.methods.register(44,1).estimateGas({from: acc});
    gasEst = (BigInt(tol) * gasEst)/BigInt(10);
    gasPriceEst = await web3.eth.getGasPrice();
    gasPriceEst = (BigInt(tol) * gasPriceEst)/BigInt(10);
  }
  catch (err){
    console.log(err);
    return;
  }

console.log(gasEst);
console.log(gasPriceEst);
  contract.methods.register(scr, gid)
    .send({from: acc, gas: gasEst, gasPrice: gasPriceEst})
    .catch((error) => {
        console.error('Call Error:', error);
        return;
    });

  const ts = (Date.now()).toString();
  const data = {
    wallet: acc,
    timestamp: ts,
    score: scr.toString(),
    chain: chn.toUpperCase(),
    gameId: gid.toString(),
    sessionId: acc.concat((Math.floor(Math.random(1000,9999))).toString()).concat(ts)
  };
  try{
    const res = await axios.post("https://gm-serve3.onrender.com/api/megustacampaign/set", {
      data: data,
    });

    console.log(res);
  }
  catch (err){
    console.log(err);
  }

}
window.registerScore = registerScore;

async function openTab(s){
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(s).classList.add('active');
  const str = s.concat('button');

  document.getElementById(str).classList.add('active');
}
window.openTab = openTab;


async function load_scores2(){
  var tbody1 = document.getElementById('tbd1');
  var tbody2 = document.getElementById('tbd2');
  var tbody3 = document.getElementById('tbd3');

  var retpre1 = [];
  var retpre2 = [];
  var retpre3 = [];
  let st1 = localStorage.getItem('megpl1') || sph1;
  let st2 = localStorage.getItem('megpl2') || sph2;
  let st3 = localStorage.getItem('megpl3') || sph3;

  let clc1 = st1.split(',');
  let clc2 = st2.split(',');
  let clc3 = st3.split(',');

  if (clc1.length != 21 || clc2.length != 21 || clc3.length != 21){
    console.log('anomaly detected');
    st1 = sph1;
    st2 = sph2;
    st3 = sph3;
    clc1 = st1.split(',');
    clc2 = st2.split(',');
    clc3 = st3.split(',');
  }
  else {
    const isValid = arr => arr.slice(0, -1).every(item =>
      typeof item === 'string' && (item.split('|')).length === 5
    );
    if (isValid(clc1) && isValid(clc2) && isValid(clc3)){
      console.log('all clear....proceeding');
    }
    else {
      console.log('anomaly detected');
      st1 = sph1;
      st2 = sph2;
      st3 = sph3;
      clc1 = st1.split(',');
      clc2 = st2.split(',');
      clc3 = st3.split(',');
    }
  }


  var k = 0;
  while (k < 20){
    var el1 = clc1[k].split('|');
    var el2 = clc2[k].split('|');
    var el3 = clc3[k].split('|');
    retpre1.push(el1);
    retpre2.push(el2);
    retpre3.push(el3);
    k++;
  }



  k = 0;
  while (k < retpre1.length){
    const r1 = document.createElement('tr');
    const rankcell1 = document.createElement('td');
    rankcell1.id = 'r1'.concat((k+1).toString());
    const walletcell1 = document.createElement('td');
    walletcell1.id = 'w1'.concat((k+1).toString());
    const scorecell1 = document.createElement('td');
    scorecell1.id = 's1'.concat((k+1).toString());
    const chaincell1 = document.createElement('td');
    chaincell1.id = 'ch1'.concat((k+1).toString());
    const datecell1 = document.createElement('td');
    datecell1.id = 'd1'.concat((k+1).toString());

    rankcell1.textContent = k + 1;
    walletcell1.textContent = retpre1[k][1];
    chaincell1.textContent = retpre1[k][2];
    scorecell1.textContent = retpre1[k][3];
    datecell1.textContent = (retpre1[k][4]).slice(0,10);



    r1.appendChild(rankcell1);
    r1.appendChild(walletcell1);
    r1.appendChild(scorecell1);
    r1.appendChild(chaincell1);
    r1.appendChild(datecell1);


    tbody1.appendChild(r1);

    const r2 = document.createElement('tr');
    const rankcell2 = document.createElement('td');
    rankcell2.id = 'r2'.concat((k+1).toString());
    const walletcell2 = document.createElement('td');
    walletcell2.id = 'w2'.concat((k+1).toString());
    const scorecell2 = document.createElement('td');
    scorecell2.id = 's2'.concat((k+1).toString());
    const chaincell2 = document.createElement('td');
    chaincell2.id = 'ch2'.concat((k+1).toString());
    const datecell2 = document.createElement('td');
    datecell2.id = 'd2'.concat((k+1).toString());

    rankcell2.textContent = k + 1;
    walletcell2.textContent = retpre2[k][1];
    chaincell2.textContent = retpre2[k][2];
    scorecell2.textContent = retpre2[k][3];
    datecell2.textContent = (retpre2[k][4]).slice(0,10);


    r2.appendChild(rankcell2);
    r2.appendChild(walletcell2);
    r2.appendChild(scorecell2);
    r2.appendChild(chaincell2);
    r2.appendChild(datecell2);


    tbody2.appendChild(r2);

    const r3 = document.createElement('tr');
    const rankcell3 = document.createElement('td');
    rankcell3.id = 'r3'.concat((k+1).toString());
    const walletcell3 = document.createElement('td');
    walletcell3.id = 'w3'.concat((k+1).toString());
    const scorecell3 = document.createElement('td');
    scorecell3.id = 's3'.concat((k+1).toString());
    const chaincell3 = document.createElement('td');
    chaincell3.id = 'ch3'.concat((k+1).toString());
    const datecell3 = document.createElement('td');
    datecell3.id = 'd3'.concat((k+1).toString());

    rankcell3.textContent = k + 1;
    walletcell3.textContent = retpre3[k][1];
    chaincell3.textContent = retpre3[k][2];
    scorecell3.textContent = retpre3[k][3];
    datecell3.textContent = (retpre3[k][4]).slice(0,10);


    r3.appendChild(rankcell3);
    r3.appendChild(walletcell3);
    r3.appendChild(scorecell3);
    r3.appendChild(chaincell3);
    r3.appendChild(datecell3);




    tbody3.appendChild(r3);

    k++;
  }


  var ret1 = [];
  var ret2 = [];
  var ret3 = [];
  try{
    const res = await axios.post("https://gm-serve3.onrender.com/api/megustacampaign/all", {
      data: null,
    });
    var i = 0;
    while (i < res.data.entries1.length){
      ret1.push(res.data.entries1[i]);
      i++;
    }
    i = 0;
    while (i < res.data.entries2.length){
      ret2.push(res.data.entries2[i]);
      i++;
    }
    i = 0;
    while (i < res.data.entries3.length){
      ret3.push(res.data.entries3[i]);
      i++;
    }

  }
  catch (err){
    console.log(err);
  }
  console.log('First Game:');
  console.log(ret1);
  console.log('Second Game');
  console.log(ret2);
  console.log('Third Game');
  console.log(ret3);

  const acc = localStorage.getItem("acc");
  var accInTopScores = false;




  if (ret1.length != ret2.length || ret2.length != ret3.length || ret3.length != 20){
    alert('Something went wrong. Please try later.');
    return;
  }



  var j = 0;
  var s1 = "";
  var s2 = "";
  var s3 = "";
  while (j < ret1.length){
    const rankcell1 = document.getElementById('r1'.concat((j+1).toString()));
    const walletcell1 = document.getElementById('w1'.concat((j+1).toString()));
    const scorecell1 = document.getElementById('s1'.concat((j+1).toString()));
    const chaincell1 = document.getElementById('ch1'.concat((j+1).toString()));
    const datecell1 = document.getElementById('d1'.concat((j+1).toString()));

    rankcell1.textContent = j + 1;
    walletcell1.textContent = ret1[j].wallet;
    chaincell1.textContent = ret1[j].chain;
    scorecell1.textContent = ret1[j].score;
    datecell1.textContent = (ret1[j].timestamp).slice(0,10);

    if (acc.toUpperCase() === (ret1[j].wallet).toUpperCase()){
      const parent1 = rankcell1.parentNode;
      parent1.style.color = 'red';
    }



    s1 = s1.concat((j + 1).toString().concat('|').concat(ret1[j].wallet).concat('|').concat(ret1[j].chain).concat('|').concat(ret1[j].score).concat('|').concat(ret1[j].timestamp).concat(","));

    const rankcell2 = document.getElementById('r2'.concat((j+1).toString()));
    const walletcell2 = document.getElementById('w2'.concat((j+1).toString()));
    const scorecell2 = document.getElementById('s2'.concat((j+1).toString()));
    const chaincell2 = document.getElementById('ch2'.concat((j+1).toString()));
    const datecell2 = document.getElementById('d2'.concat((j+1).toString()));

    rankcell2.textContent = j + 1;
    walletcell2.textContent = ret2[j].wallet;
    chaincell2.textContent = ret2[j].chain;
    scorecell2.textContent = ret2[j].score;
    datecell2.textContent = ret2[j].timestamp.slice(0,10);

    if (acc.toUpperCase() === (ret2[j].wallet).toUpperCase()){
      const parent2 = rankcell2.parentNode;
      parent2.style.color = 'red';
    }

    s2 = s2.concat((j + 1).toString().concat('|').concat(ret2[j].wallet).concat('|').concat(ret2[j].chain).concat('|').concat(ret2[j].score).concat('|').concat(ret2[j].timestamp).concat(","));


    const rankcell3 = document.getElementById('r3'.concat((j+1).toString()));
    const walletcell3 = document.getElementById('w3'.concat((j+1).toString()));
    const scorecell3 = document.getElementById('s3'.concat((j+1).toString()));
    const chaincell3 = document.getElementById('ch3'.concat((j+1).toString()));
    const datecell3 = document.getElementById('d3'.concat((j+1).toString()));
    rankcell3.textContent = j + 1;
    walletcell3.textContent = ret3[j].wallet;
    chaincell3.textContent = ret3[j].chain;
    scorecell3.textContent = ret3[j].score;
    datecell3.textContent = ret3[j].timestamp.slice(0,10);

    if (acc.toUpperCase() === (ret3[j].wallet).toUpperCase()){
      const parent3 = rankcell3.parentNode;
      parent3.style.color = 'red';
    }

    s3 = s3.concat((j + 1).toString().concat('|').concat(ret3[j].wallet).concat('|').concat(ret3[j].chain).concat('|').concat(ret3[j].score).concat('|').concat(ret3[j].timestamp).concat(","));


    j++;
  }


  localStorage.setItem('megpl1', s1);
  localStorage.setItem('megpl2', s2);
  localStorage.setItem('megpl3', s3);

  document.getElementById('wait').style.display = 'none';


  if (acc === "" || acc === " " || !acc){
    return;
  }

  await getMyScore();
}
window.load_scores2 = load_scores2;

// test functions

async function testDb1(){
  const data = {
    wallet: '0xD0dC8A261Ad1B75A92C5e502AE10c3Fde042b879',
    gameId: "3"
  };

  try{
    const res = await axios.post("https://gm-serve3.onrender.com/api/megustacampaign/get", {
      data: data,
    });
    console.log(res.data.entries);
  }
  catch (err){
    console.log(err);
  }
}
window.testDb1 = testDb1;


async function testDb(){
  const wl = '0xD0dC8A261Ad1B75A92C5e502AE10c3Fde042b800';
  const ts = (Date.now()).toString();
  const data = {
    wallet: wl,
    timestamp: ts,
    score: "111",
    chain: "MNT",
    gameId: "3",
    sessionId: wl.concat((Math.floor(Math.random(1000,9999))).toString()).concat(ts)
  };
  try{
    const res = await axios.post("https://gm-serve3.onrender.com/api/megustacampaign/set", {
      data: data,
    });

    console.log(res);
  }
  catch (err){
    console.log(err);
  }
}
window.testDb = testDb;
