let tabs;
let gettingActiveTab;

var tradeBtn = document.getElementById('tradeBtn');

async function Load(){
  gettingActiveTab = await browser.tabs.query({active: true, currentWindow: true});

  console.log('Current URL: ' + gettingActiveTab[0].url);

  var domain = gettingActiveTab[0].url.split('/')[2]

  document.getElementById('chatIframe').src = 'https://decglocha.herokuapp.com/?topic=' + domain;
  console.log(domain);
}

console.log('TRADEBTN:')
console.log(tradeBtn);
//add event listener
tradeBtn.addEventListener('click', async function(event) {
  console.log('AirSwap');
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
});

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  Load();
});
