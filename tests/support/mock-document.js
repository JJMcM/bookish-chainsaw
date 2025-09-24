class MockTextNode {
  constructor(text, document) {
    this.nodeType = 3;
    this.textContent = text;
    this.ownerDocument = document;
  }
}

class MockStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value) {
    this.properties.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.properties.get(name) ?? "";
  }

  removeProperty(name) {
    this.properties.delete(name);
  }
}

class MockElement {
  constructor(tagName, document) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = document;
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.style = new MockStyle();
    this._textContent = "";
    this.className = "";
    this.value = "";
    this.parentNode = null;
    this.listeners = new Map();
  }

  append(...nodes) {
    nodes.forEach((node) => this.appendChild(node));
  }

  appendChild(node) {
    if (node === null || node === undefined) {
      return;
    }

    if (typeof node === "string") {
      node = new MockTextNode(node, this.ownerDocument);
    }

    if (node.nodeType === 3) {
      this.children.push(node);
    } else {
      node.parentNode = this;
      this.children.push(node);
    }
  }

  createEvent(type) {
    return { type, target: this };
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);
  }

  removeEventListener(type, handler) {
    this.listeners.get(type)?.delete(handler);
  }

  dispatchEvent(event) {
    const handlers = this.listeners.get(event.type);
    if (!handlers) {
      return false;
    }
    handlers.forEach((handler) => handler(event));
    return true;
  }

  get firstChild() {
    return this.children[0] ?? null;
  }

  get textContent() {
    if (this.children.length === 0) {
      return this._textContent;
    }
    return this.children
      .map((child) => (child.nodeType === 3 ? child.textContent : child.textContent))
      .join("");
  }

  set textContent(value) {
    this.children = [];
    this._textContent = String(value ?? "");
  }

  get innerHTML() {
    return this.children.map((child) => child.textContent ?? "").join("");
  }

  set innerHTML(value) {
    this.children = [];
    if (value) {
      this.appendChild(String(value));
    }
  }
}

class MockDocument {
  constructor() {
    this.elements = new Map();
    this.body = new MockElement("body", this);
    this.documentElement = new MockElement("html", this);
    this.title = "";
  }

  register(selector, element) {
    this.elements.set(selector, element);
    element.ownerDocument = this;
    return element;
  }

  querySelector(selector) {
    return this.elements.get(selector) ?? null;
  }

  createElement(tagName) {
    return new MockElement(tagName, this);
  }

  createTextNode(text) {
    return new MockTextNode(text, this);
  }
}

export { MockDocument, MockElement, MockTextNode, MockStyle };

export const createMockDocument = () => new MockDocument();
