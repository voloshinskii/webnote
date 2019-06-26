/**
 * Import Tool's icon
 */
 import ToolboxIcon from './icon.svg';

 /**
  * Build styles
  */
 require('./index.css').toString();

/**
 * @class Map
 * @classdesc Map Tool for Editor.js
 * @property {MapData} data - Map Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Map Tool`s input and output data
 * @property {string} item - Map`s title
 * @property {string} message - Map`s message
 *
 * @typedef {object} WarningConfig
 * @description Map Tool`s initial configuration
 * @property {string} itemPlaceholder - placeholder to show in Map`s item input
 * @property {string} itemsPlaceholder - placeholder to show in Map`s items input
 */
export class Map {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
      return {
        icon: ToolboxIcon,
        title: '<API> Map'
      };
  }

  /**
   * Allow to press Enter inside the Warning
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ITEMS_PLACEHOLDER() {
    return 'property to parse';
  }

  /**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ITEM_PLACEHOLDER() {
    return 'map item';
  }

  /**
   * Warning Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-map',
      items: 'cdx-map__items',
      input: ['cdx-map-input', 'cdx-input-in-block', this.api.styles.input],
      item: 'cdx-map__item',
      nativeInput: 'cdx-map-input'
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {WarningData} data — previously saved data
   * @param {WarningConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this.itemsPlaceholder = config.itemsPlaceholder || Map.DEFAULT_ITEMS_PLACEHOLDER;
    this.itemPlaceholder = config.itemPlaceholder || Map.DEFAULT_ITEM_PLACEHOLDER;

    this.data = {
      items: data.items || '',
      item: data.item || ''
    };
  }

  /**
   * Create Map Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);

		const map = this._make('h3', [], {
			style: "margin-left: 10px"
		});
		map.innerHTML = "&lt;API[Map]&gt;";
		container.appendChild(map);

		const foreach = this._make('div', [], {
			style: "margin-left: 10px; color: #5d8edd",
			innerHTML: "foreach"
		});

    const items = this._make('div', [...this.CSS.input, this.CSS.items], {
      contentEditable: true,
      innerHTML: this.data.items
    });

		const rtrn = this._make('div', [], {
			style: "margin-left: 10px; color: #b279a2",
			innerHTML: "return"
		});

    const item = this._make('div', [...this.CSS.input, this.CSS.item], {
      contentEditable: true,
      innerHTML: this.data.item
    });

    items.dataset.placeholder = this.itemsPlaceholder;
    item.dataset.placeholder = this.itemPlaceholder;

		container.appendChild(foreach);
    container.appendChild(items);
		container.appendChild(rtrn);
    container.appendChild(item);

    return container;
  }

  /**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(mapElement) {
    const items = mapElement.querySelector(`.${this.CSS.items}`);
    const item = mapElement.querySelector(`.${this.CSS.item}`);

    return Object.assign(this.data, {
      items: items.innerHTML,
      item: item.innerHTML
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Warning Tool saved data
   * @return {Object}
   */
   static get sanitize() {
      return {
          items: {},
          item: {}
      };
  }
}

export class MapEnd {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
      return {
        icon: ToolboxIcon,
        title: '<API> Map End'
      };
  }

  /**
   * Allow to press Enter inside the Warning
   * @public
   * @returns {boolean}
   */

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-map',
      items: 'cdx-map__items',
      input: ['cdx-map-input', 'cdx-input-in-block', this.api.styles.input],
      item: 'cdx-map__item',
      nativeInput: 'cdx-map-input'
    };
  }

  constructor({data, config, api}) {
    this.api = api;

    this.data = {
      end: true,
    };
  }

  /**
   * Create Map Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);

		const map = this._make('h3', [], {
			style: "margin-left: 10px"
		});
		map.innerHTML = "&lt;API[Map] /&gt;";
		container.appendChild(map);

    return container;
  }

  /**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(mapElement) {
    return Object.assign(this.data, {
      end: true,
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Warning Tool saved data
   * @return {Object}
   */
   static get sanitize() {
      return {
          end: true,
      };
  }
}
