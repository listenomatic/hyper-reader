import { DefaultDOMElement } from 'substance'
import { stripNamespace } from './utils'

async function renderSection (dom, domNode, hrNode) {
  const section = dom.createElement('div')
  section.setAttribute('data-id', stripNamespace(hrNode.name))
  await hrNode.iterate(executeRender(dom, section))
  domNode.appendChild(section)
  return section
}

async function renderTitle (dom, domNode, hrNode) {
  const text = await hrNode.get('c4o:hasContent')
  const h1 = dom.createElement('h1').setTextContent(text)
  h1.setAttribute('data-id', stripNamespace(hrNode.name))
  domNode.appendChild(h1)
  return h1
}

async function renderParagraph (dom, domNode, hrNode) {
  const text = await hrNode.get('c4o:hasContent')
  const p = dom.createElement('p').setTextContent(text)
  p.setAttribute('data-id', stripNamespace(hrNode.name))
  domNode.appendChild(p)
  return p
}

const renderers = {
  'doco:Section': renderSection,
  'doco:Title': renderTitle,
  'doco:Paragraph': renderParagraph
}

function executeRender (dom, domNode) {
  return (node) => {
    console.log(node.name, node.type)
    const renderer = renderers[node.type]
    if (!renderer) {
      console.warn('No renderer setup for', node.type)
      return
    }
    return renderer(dom, domNode, node)
  }
}

async function render (hr) {
  const dom = DefaultDOMElement.createDocument()
  const domBody = dom.find('body')
  const hrBody = await hr.body()
  if (!hrBody) return dom
  await hrBody.iterate(executeRender(dom, domBody))
  return dom
}

function hr2Dom (hr) {
  return render(hr)
}

export default hr2Dom