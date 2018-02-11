/**
 * Display content of each node of a webpage
 */


 // call main function
 init()

 /*
  replace content of node
  */
 function replaceContainerContent(newContent) {
     let parent = document.getElementById('container')
     while(parent.firstChild) {
         parent.firstChild.remove()
     }
    parent.appendChild(newContent)
 }

 /*
  Create new node for the summary
  */
 function displayMessage(message) {
     let p = document.createElement('p')
     p.textContent = message
     replaceContainerContent(p)
     return p
 }


 function displaySideBar () {
     displayMessage('Loading content...')
     displaySideBarAsync().catch((error) => displayMessage(error.message))
 }

 async function displaySideBarAsync () {
     let headings = await getHeadings()
     displayHeadings(headings)
 }

 async function getHeadings () {
     let tab = await getActiveTab()
     await sendScript(tab.id)
     return browser.tabs.sendMessage(tab.id, 
        {action: 'getHeadings'})
 }


 async function getActiveTab () {
     return (await browser.tabs.query({currentWindow: true, active: true}))[0]
 }

 async function sendScript (tabId) {
    await browser.tabs.executeScript(tabId, 
        {file: 'content-script.js'})
 }

function displayHeadings (headings) {
    let div = document.createElement('div')
    headings.forEach((heading) => {
        div.appendChild(headingToNode(heading))
    })
replaceContainerContent(div)
}
                
function headingToNode (heading) {
    let anchor = document.createElement('a')
    anchor.addEventListener('click', () =>
        scrollTabToId(heading.id))
    anchor.textContent = heading.text
    let node = document.createElement(heading.tag)
    node.appendChild(anchor)
    return node
}

async function scrollTabToId (id) {
    let tab = await getActiveTab()
    return browser.tabs.sendMessage(tab.id , { action: 'scroll', id })
}

 function init () {
     // refresh sideBar when user choose a tab
     browser.tabs.onActivated.addListener(() => {
         displaySideBar()
     })
     // refresh sidebar when current tab is refresh
     browser.tabs.onUpdated.addListener(() => {
         displaySideBar()
     })
    displaySideBar()
 }

