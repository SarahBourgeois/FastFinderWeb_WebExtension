

function messageReceived (message) {
    if (message.action === 'getHeadings') {
        return getHeadings()
    }   
    if (message.action === 'scroll') {
        scrollToId(message.id)
        return Promise.resolve()
    }
    return Promise.reject(new Error('Unknow action'))
}

function scrollToId (id) {
    document.getElementById(id).scrollIntoView()
}

/**
 * Generate a guid
 */
function guid () {
    function _p8 (s) {
        var p = (Math.random().toString(16) + '000000000').substr(2,8)
        return s ? '-' + p.substr(0, 4) : p
    }
    return _p8() + _p8(true) + _p8(true) + _p8()
} 

  

function getHeadings () {
    let nodes = document.body.querySelectorAll('h1, h2, h3, h4, h5, h6')

    let result = []

    nodes.forEach((node) => {
        result.push(nodeToHeading(node))
    })
    return Promise.resolve(result)
}

function nodeToHeading (node) {
    // check if heading had id else affect guid
    let id;
    if (node.id) {
        id = node.id
    }
    else {
        id = guid()
        node.id=id
    }
    return {
        id :id,
        tag: node.tagName,
        text: node.textContent
    }
} 

  /*
   Event
  */

  
browser.runtime.onMessage.addListener(messageReceived)

