const createProvider = require('../../');
const Eth = require('ethjs');
var myWindowId;
const contentBox = document.querySelector("#content");

//get a reference to the element
var myBtn = document.getElementById('send');

const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
gettingActiveTab.then((tabs) => {
  console.log('Current URL: ' + tabs[0].url)
});

async function test4(){
  const provider = createProvider();
  console.log('Loading...')

  if (provider) {
    console.log('provider detected', provider)
    console.log("JOHNS TEST")
    // await provider.enable();
    await provider.send({method: 'eth_requestAccounts'}, console.log);
    const eth = new Eth(provider);
    // await eth.enable();
    console.log('MetaMask provider detected.')
    // const accounts = await window.ethereum.enable();
    eth.accounts()
    .then((accounts) => {
      console.log('IS THIS WORING?')
      console.log(accounts[0])
      console.log(`Detected MetaMask account ${accounts[0]}`)
    })

    provider.on('error', (error) => {
      if (error && error.includes('lost connection')) {
        console.log('MetaMask extension not detected.')
      }
    })

  } else {
    console.log('MetaMask provider not detected.')
  }
}

function air(){
  // THIS HAS ACCESS TO METAMASK!!
  window.AirSwapTrader.render(
    {
      onCreate: (order, cid) => {
        console.log('Order created!')
      },
      onClose: (transactionHash) => {
        console.log('Widget closed')
      },
    },
    'body',
  )
}

async function test2(){
  /*
  registered = await browser.contentScripts.register({
    matches: ["<all_urls>"],
    file: "/content_scripts/crypto.js"
  });
  Above not working with file
  */
  console.log('Loading Web3...')
  await browser.tabs.executeScript({file: "/content_scripts/web3.min.js"});
  console.log('Web3 Loaded')
  console.log('Loading Ethers...')
  await browser.tabs.executeScript({file: "/content_scripts/ethers.min.js"});
  console.log('Ethers Loaded')
  console.log('Loading Crypto...')
  await browser.tabs.executeScript({file: "/content_scripts/crypto.js"});
  console.log('Crypto Loaded')

  const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    console.log('Sending web3 message...')
    browser.tabs.sendMessage(tabs[0].id, {command: "crypto"});
    //browser.tabs.sendMessage(tabs[0].id, {command: "web3"});
    console.log('Web3 message done')
  });
  /*
  browser.tabs.executeScript({
    file: "/content_scripts/web3.min.js"
  }).then(console.log('Web3 Loaded'))
      .catch(reportError);

  browser.tabs.executeScript({
    file: "/content_scripts/crypto.js"
  }).then(console.log('Crypto Loaded'))
      .catch(reportError);
  */
}

function test3(){
  document.getElementById('myIframe').src = "https://xhamster.com";
}

function reportError(error) {
  console.error(`Could not inject content script: ${error}`);
}

async function test(){
  // const accounts = await browser.ethereum.enable();
  //let provider = ethers.getDefaultProvider('homestead');
  //console.log(provider)
  //console.log(accounts[0]);

  // Then we initialize a new 3Box session
  // const box = await Box.openBox(accounts[0], window.ethereum);
  const profile = await Box.getProfile('0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059');
  console.log(profile);
  console.log('opeinign')
  //const box = await Box.openBox('0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059', provider);
  //console.log('open')
  //console.log(box)

  browser.tabs.executeScript({
    file: "/content_scripts/crypto.js"
    }).then(messageContent)
      .catch(reportError);

    function messageContent(){
      const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
      gettingActiveTab.then((tabs) => {
        console.log('Sending message...')
        browser.tabs.sendMessage(tabs[0].id, {command: "crypto"});
      });
    }




  /*
  window.AirSwapTrader.render(
    {
      onCreate: (order, cid) => {
        console.log('Order created!')
      },
      onClose: (transactionHash) => {
        console.log('Widget closed')
      },
    },
    'body',
  )
  */
}
//add event listener
myBtn.addEventListener('click', async function(event) {
  console.log('WOW');
  //test2()
  //air();
  //test3();
  test4();

});

/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  contentBox.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  contentBox.setAttribute("contenteditable", false);
  browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
    let contentToStore = {};
    contentToStore[tabs[0].url] = contentBox.textContent;
    browser.storage.local.set(contentToStore);
  });
});

/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
  browser.tabs.query({windowId: myWindowId, active: true})
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url);
    })
    .then((storedInfo) => {
      contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});
