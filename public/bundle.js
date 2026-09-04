(() => {
  // src/inject.js
  var stringToHTML = (str) => {
    const parse = new DOMParser();
    const doc = parse.parseFromString(str, "text/html");
    return doc.body.firstChild;
  };
  var stringToHTMLTable = (str) => {
    const thing = `<table>
        <tbody>${str} </tbody>
    </table>`;
    const parse = new DOMParser();
    const doc = parse.parseFromString(thing, "text/html");
    return doc.querySelector("tr");
  };

  // src/injects/markers.js
  var markerElement = (row) => {
    return `
       <div> This is an example to be fixed later </div> 
    `;
  };

  // src/injects/characters.js
  var characterRow = (row) => {
    const charRow = stringToHTMLTable(`
        <tr>
            <td>${row.characterName}</td>
            <td>${row.characterProfession}</td>
            <td>${row.characterTraits}</td>
        </tr>
    `);
    return charRow;
  };
  var characterCardForm = (row) => {
    return stringToHTML(`
<div class="characterCard">
    <div class="Infodeck">
        <img class="Portrait" src="${row.characterImage}" alt="">
        <input type='file' accept="image/*" class="characterImageInput" data-action="Image" data-value="${row.characterImage}"> <table>
            <tbody>
                <tr> <td>Name: </td> <td><input type="text" name="characterName" value="${row.characterName}"></td></tr>
                <tr> <td>Pronouns: </td> <td><input type="text" name="characterPronouns" value="${row.characterPronouns}"></td></tr>
                <tr> <td>Profession: </td> <td><input type="text" name="characterProfession" value="${row.characterProfession}"></td></tr>
                <tr> <td>Home: </td> <td><input data-action="Homes" type="text" list="homesFilter" name="characterHome" value="${row.characterHome}"></td></tr>
                <tr> <td>Traits: </td> <td><input type="text" name="characterTraits" value="${row.characterTraits}"></td></tr>
            </tbody>
        </table>
    </div>
    <div class="CharacterInfo">
        <div class="columnTitle"> History </div>
        <textarea class="characterInfo">${row.characterInfo}</textarea>
        <button data-action="Update" type="button" name="Submit"> Submit </button>
        <button data-action="Delete" type="button" name="Delete"> Delete </button>
    </div>       
</div>`);
  };
  var characterCard = (row) => {
    return stringToHTML(`
<div class="characterCard">
    <div class="Infodeck">
        <img class="Portrait"src="${row.characterImage}" alt="">
        <div class="NameCard">
            <div class="characterName">${row.characterName} </div> 
            <div class="characterPronouns"> (${row.characterPronouns}) </div>
        </div>
        <table>
            <tbody>
                <tr> <td>Home: </td> <td>${row.characterHome}</td></tr>
                <tr> <td>Profession: </td> <td>${row.characterProfession}</td></tr>
                <tr> <td>Traits: </td> <td>${row.characterTraits}</td></tr>
            </tbody>
        </table>
    </div>
    <div class="characterNotes">
        <div class="tabHeaders">
            <div class="tabTitle">
                History
            </div>
            <div data-action="Edit" class="tabIcon fontMod">&#x270D</div>
        </div>
        <div class="characterInfo">${row.characterInfo}</div>
    </div>       
</div>`);
  };
  var characterLoading = () => {
    return stringToHTML(`
    <div class="CharacterCard">
        <div class="ColumnTitle">Sending... </div>
    </div>
    `);
  };

  // src/animation.js
  var indicateTimers = /* @__PURE__ */ new Map();
  var updateIndicate = (el) => {
    const prior = indicateTimers.get(el);
    if (prior) clearTimeout(prior);
    el.style.transition = "box-shadow 0.15s ease, outline-color 0.15s ease";
    el.style.boxShadow = "0px 0px 3px 2px lightblue";
    el.style.outlineColor = "lightblue";
    const t = setTimeout(() => {
      el.style.boxShadow = "none";
      el.style.outlineColor = "#333";
      indicateTimers.delete(el);
    }, 500);
    indicateTimers.set(el, t);
  };

  // src/document.js
  var socket = io();
  var addBoxTemplate = document.getElementById("addBoxTemplate");
  var maps = document.getElementById("worldMaps");
  var characters = document.getElementById("characters");
  var UpdatingFromServerState = class {
    constructor() {
      this.isUpdatingFromServer = 0;
    }
    stepUp() {
      this.isUpdatingFromServer++;
    }
    stepDown() {
      this.isUpdatingFromServer--;
    }
    check() {
      if (this.isUpdatingFromServer > 0) return true;
      else return false;
    }
  };
  var isUpdatingFromServerState = new UpdatingFromServerState();
  var Node = class {
    constructor(element) {
      this.element = element;
      this.prev = null;
      this.next = null;
    }
  };
  var LinkedList = class {
    constructor() {
      this.head = null;
      this.end = this.head;
    }
    append(element) {
      let newNode = new Node(element);
      if (!this.head) {
        this.head = newNode;
        this.end = newNode;
      } else {
        newNode.prev = this.end;
        this.end.next = newNode;
        this.end = newNode;
      }
      element.__nodeRef = newNode;
      return newNode;
    }
    popNode(node) {
      if (!this.head) return;
      if (this.head === node) {
        this.head = node.next;
        if (this.head) this.head.prev = null;
        if (node === this.end) this.end = null;
      } else {
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === this.end) this.end = node.prev;
      }
      if (node.element) delete node.element.__nodeRef;
      return node;
    }
  };
  var graphNode = class {
    constructor(name, identifiers, parent3, cascadeRules, createOperator, updateOperator, deleteOperator, attachElement) {
      this.table = {};
      this.name = name;
      this.identifiers = identifiers;
      this.parent = parent3;
      this.cascadeRules = cascadeRules;
      this.createOperator = createOperator;
      this.updateOperator = updateOperator;
      this.deleteOperator = deleteOperator;
      if (attachElement) {
        this.attachElement = document.getElementById(attachElement);
        this.attachElement.__graphNodeRef = this;
      }
    }
    makeIndex(requirements, row) {
      const index = requirements.map((item) => row[item]).join("/%/");
      return index;
    }
    createRow(row) {
      const element = this.createOperator(row);
      console.log(this.identifiers);
      const index = this.makeIndex(this.identifiers, row);
      element.__rowReference = row;
      row.element = element;
      this.table[index] = row;
      updateIndicate(element);
      if (Object.keys(this.cascadeRules).length !== 0) {
        const upIndex = this.cascadeRules.down == void 0 ? row.characterHome : this.makeIndex(this.cascadeRules.down, row);
        const subscribeObject = {
          self: this,
          cascadeRules: this.cascadeRules,
          rows: [index]
        };
        this.parent.addSubscriber(upIndex, this.name, subscribeObject);
      }
    }
    addSubscriber(index, child, subscriberWrapper) {
      const row = this.table[index];
      if (!row) throw Error(`Index does not exist! Gen Index: ${index} child: ${child}`);
      if (row.subscribers === void 0) row.subscribers = {};
      if (Object.keys(row.subscribers).length !== 0 && row.subscribers[child]) {
        const oldrows = row.subscribers[child].rows;
        const newrows = subscriberWrapper.rows;
        row.subscribers[child].rows = [...oldrows, ...newrows];
      } else {
        row.subscribers[child] = subscriberWrapper;
      }
    }
    updateRow(updateValue) {
      const index = this.makeIndex(this.identifiers, updateValue);
      const row = this.table[index];
      if (!row) throw Error(`${row} does not exist!`);
      const changes = {};
      for (const [key, value] of Object.entries(updateValue)) {
        if (row[key] !== value) {
          changes[key] = row[key];
          row[key] = value;
        }
      }
      const element = this.updateOperator(row);
      element.__rowReference = row;
      row.element = element;
      updateIndicate(row.element);
      if (row.subscribers) {
        for (const [lmao, subscriber] of Object.entries(row.subscribers)) {
          const downer = {};
          for (const key of subscriber.cascadeRules.up) {
            const newer = changes[subscriber.cascadeRules.up[key]];
            if (newer) downer[subscriber.cascadeRules.down[key]] = newer;
          }
          for (const [key, value] of Object.entries(subscriber.cascadeRules.additional)) {
            if (changes[key]) downer[value] = changes[key];
          }
          if (downer) subscriber.self.updateCascade(subscriber, downer);
        }
      }
    }
    updateCascade(observer, changes) {
      const indexes = observer.rows;
      for (const [iterator, index] of indexes.entries) {
        const row = this.table[index];
        let needsIndexFix = false;
        for (const [key, value] of Object.entries(changes)) {
          if (this.identifiers.includes(key)) needsIndexFix = true;
          row[key] = value;
        }
        if (needsIndexFix) {
          const newIndex = this.makeIndex(this.identifiers, row);
          this.table[newIndex] = row;
          indexes[iterator] = newIndex;
          delete this.table[index];
        }
        this.updateRow(row);
      }
    }
    deleteRow(deletedItem) {
      const row = this.table[deletedItem];
      if (!row) return;
      if (row.latestModified > deletedItem.deletedAt) return;
      this.deleteOperator(row);
      if (this.table[deletedItem].subscribers) {
        for (const subscriber of row.subscribers) {
          subscriber.self.deleteCascade(deletedItem);
        }
      }
      delete this.table[deletedItem];
    }
    deleteCascade(id) {
      if (Object.keys(this.cascadeRules.up).length === 0) {
        for (const [key, value] of Object.entries(this.table)) {
          if (key.startsWith(id)) {
            this.deleteRow(key);
          }
          ;
        }
      } else {
        for (const [key, value] of this.table) {
          if (value.characterHome == id) {
            value.characterHome = "At World's End";
            this.updateOperator(value);
          }
        }
      }
    }
  };

  // src/injects/homes.js
  var newHome = (row) => {
    return stringToHTML(`
    <div id="${row.homeName}" class='S'> ${row.homeName}
    </div>
    `);
  };
  var newSelectionHome = (row) => {
    return stringToHTML(
      `
        <option value="${row.homeName}">${row.homeName} </option>
        `
    );
  };

  // src/dataHandler/data/homesHandler.js
  var worldMap = document.querySelector("#worldMaps ul");
  var createSelection = (row) => {
    const parents = document.querySelectorAll(`[data-entrypoint="homes"]`);
    let homeStore = [];
    parents.forEach((parent3) => {
      let element = null;
      if (parent3.tagName == "DATALIST") {
        element = newSelectionHome(row);
      } else if (parent3.tagName == "SELECT") {
        element = newSelectionHome(row);
      }
      parent3.appendChild(element);
      homeStore.push(element);
    });
    return homeStore;
  };
  var updateSelection = (homeStore, row) => {
    let newHomeStore = [];
    homeStore.forEach((element) => {
      let newElement = null;
      if (element.tagName !== "OPTION") return;
      newElement = newSelectionHome(row);
      element.replaceWith(newElement);
      newHomeStore.push(newElement);
    });
    return newHomeStore;
  };
  var homesCreateOperator = (row) => {
    const homeElement = newHome(row);
    homeElement.__selectionReference = createSelection(row);
    worldMap.appendChild(homeElement);
    return homeElement;
  };
  var homesUpdateOperator = (row) => {
    const newHomeElement = newHome(row);
    newHomeElement.__selectionReference = updateSelection(row.element.__selectionReference, row);
    row.element.replaceWith(newHomeElement);
    return newHomeElement;
  };
  var homesDeleteOperator = (row) => {
    const removal = row.element.__selectionReference;
    removal.forEach((element) => {
      element.remove();
    });
    row.element.remove();
  };
  var homeNode = new graphNode(
    "homes",
    ["homeName"],
    {},
    {},
    homesCreateOperator,
    homesUpdateOperator,
    homesDeleteOperator
  );

  // src/dataHandler/data/locationsHandler.js
  var parent2 = document.querySelector("#locationSelector");
  var filteredList = parent2.querySelector("ul");
  var filter = document.querySelector("select");
  var locationCreateOperator = (row) => {
    const element = characterRow(row);
    if (true) parent2.append(element);
    return element;
  };
  var locationsUpdateOperator = (row) => {
    const locationElement = row.element;
    const newElement = characterRow(row);
    locationElement.replaceWith(newElement);
    return newElement;
  };
  var locationDeleteOperator = (row) => {
    row.element.remove();
  };
  var locationCascadeRules = {
    up: ["homeName"],
    down: ["locationHome"]
  };
  var locationNode = new graphNode(
    "location",
    ["locationName", "locationId"],
    homeNode,
    locationCascadeRules,
    locationCreateOperator,
    locationsUpdateOperator,
    locationDeleteOperator
  );

  // src/dataHandler/data/markersHandler.js
  var markerCreateOperator = (row) => {
    const element = markerElement(row);
    if (true) parent.append(element);
    return element;
  };
  var markersUpdateOperator = (row) => {
    const markerElement2 = row.element;
    const newElement = markerElement2(row);
    if (true) markerElement2.replaceWith(newElement);
    return newElement;
  };
  var markerDeleteOperator = (row) => {
    row.element.remove();
  };
  var markerCascadeRules = {
    up: ["locationHome", "locationId"],
    down: ["markerHome", "markerId"],
    additional: { "locationSignifier": "markerSignifier" }
  };
  var markerNode = new graphNode(
    "markers",
    ["markerName", "markerId", "markerOrder", "markerSignifier"],
    locationNode,
    markerCascadeRules,
    markerCreateOperator,
    markersUpdateOperator,
    markerDeleteOperator
  );

  // src/injects/stats.js
  var radio = (name, style, options) => {
    const elementString = `
    <div>
        ${options.map((option) => `
            <div class="${style[0]}">
                <input type="radio" name="${name}" value="${option}">
                <p class="${style[1]}">${option}</p>
            </div>
        `).join("")}
    </div>`;
    return stringToHTML(elementString);
  };
  var select = (name, style, options) => {
    const elementString = `
        <select class='${style[0]}' name="${name}" >
            ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
        </select>
    `;
    return stringToHTML(elementString);
  };
  var number = (name, style) => {
    const elementString = `<input type="number" class="${style[0]}" name="${name}">`;
    return stringToHTML(elementString);
  };
  var checkbox = (name, style) => {
    const elementString = `<input type="checkbox" class="${style[0]}" name="${name}" value="${name}">`;
    return stringToHTML(elementString);
  };

  // src/dataHandler/data/statsHandler.js
  var styleTable = {
    "radio": "radioBox,radioChoice",
    "select": "",
    "numbers": "",
    "number-asset": "numsInput",
    "checkbox": ""
  };
  var statsCreateOperator = (row) => {
    let element = null;
    const parentElement = document.getElementById(row.statName);
    const style = styleHelper(parentElement);
    let selectedElement = null;
    switch (row.statType) {
      case "radio":
        element = radio(row.statName, style, row.statOptions.split(","));
        parentElement.append(element);
        selectedElement = parentElement.querySelector(`[value="${row.statValue}"]`);
        selectedElement.checked = true;
        break;
      case "select-one":
        element = select(row.statName, style, row.statOptions.split(","));
        parentElement.append(element);
        selectedElement = parentElement.querySelector(`select`);
        selectedElement.value = row.statValue;
        break;
      case "number":
        element = number(row.statName, style);
        element.value = row.statValue;
        parentElement.append(element);
        break;
      case "checkbox":
        element = checkbox(row.statName, style);
        element.checked = row.statValue === "true";
        parentElement.append(element);
        break;
    }
    return element;
  };
  var styleHelper = (parent3) => {
    return styleTable[parent3.dataset.entrypoint].split(",");
  };
  var statsUpdateOperator = (row) => {
    const element = row.element;
    switch (row.statType) {
      case "radio":
        const selectedElement = element.querySelector(`[value="${row.statValue}"]`);
        if (selectedElement) selectedElement.checked = true;
        break;
      case "select-one":
        element.value = row.statValue;
        break;
      case "number":
        element.value = row.statValue;
        break;
      case "checkbox":
        element.checked = row.statValue === "true";
        break;
    }
    return element;
  };
  var statsDeleteOperator = (row) => {
    const selectedElement = row.element;
    selectedElement.remove();
  };
  var statNode = new graphNode(
    "stats",
    ["statName"],
    {},
    {},
    statsCreateOperator,
    statsUpdateOperator,
    statsDeleteOperator
  );

  // src/injects/lists.js
  var listsRow = (index, text) => {
    const elementString = `
        <li data-index=${index}>
            ${text}
        </li>`;
    return stringToHTML(elementString);
  };
  var rowEnter = (row) => {
    const elementString = `
        <li data-index="${row.listOrder}">
            <textarea>${row.listText}</textarea>
        </li>
    `;
    return stringToHTML(elementString);
  };

  // src/dataHandler/data/listsHandler.js
  var listsOperator = (row) => {
    const parent3 = document.querySelector(`#${row.listName} ul`);
    const element = listsRow(row.listOrder, row.listText);
    parent3.append(element);
    return element;
  };
  var listsUpdateOperator = (row) => {
    const element = row.element;
    const newElement = listsRow(row.listOrder, row.listText);
    element.replaceWith(newElement);
    return newElement;
  };
  var listsDeleteOperator = (row) => {
    row.element.remove();
  };
  var listNode = new graphNode(
    "lists",
    ["listName", "listOrder"],
    {},
    {},
    listsOperator,
    listsUpdateOperator,
    listsDeleteOperator
  );

  // src/dataHandler/data/charactersHandler.js
  var characterTable = characters.querySelector("#characterTable");
  var modal = document.getElementById("modal");
  var filterHomeValue = characters.querySelector('select[name="Home"]');
  var characterCascadeRules = {
    up: {},
    down: {},
    additional: {
      "homeName": "characterHome"
    }
  };
  var characterCreateOperator = (row) => {
    const characterElement = characterRow(row);
    if (filterHomeValue.value === row.characterHome || filterHomeValue.value === " ") characterTable.append(characterElement);
    return characterElement;
  };
  var characterUpdateOperator = (row) => {
    const characterElement = row.element;
    const newElement = characterRow(row);
    if (row.card) {
      row.card = characterCard(row);
      if (modal.firstChild) modal.removeChild(modal.firstChild);
      row.card.__rowReference = row;
      modal.append(row.card);
    }
    characterElement.replaceWith(newElement);
    return newElement;
  };
  var characterDeleteOperator = (row) => {
    const characterElement = row.element;
    characterElement.remove();
    if (row.card) {
      if (modal.firstChild) {
        if (modal.firstChild.__rowReference === row) {
          modal.removeChild(modal.firstChild);
        }
      }
      row.card.remove();
      delete row.card;
    }
  };
  var characterNode = new graphNode(
    "characters",
    ["characterId"],
    homeNode,
    characterCascadeRules,
    characterCreateOperator,
    characterUpdateOperator,
    characterDeleteOperator,
    "characters"
  );

  // src/dataHandler/syncHandler.js
  var graphNodeList = {
    "homes": homeNode,
    "markers": markerNode,
    "characters": characterNode,
    "locations": locationNode,
    "stats": statNode,
    "lists": listNode
  };
  var dataHandlers = () => {
    for (const [key, operator] of Object.entries(graphNodeList)) {
      const payload = JSON.parse(localStorage.getItem(key)) || {};
      operator.table = payload;
      for (const [id, row] of Object.entries(payload)) {
        const element = operator.createOperator(row);
        element.__rowReference = row;
        row.element = element;
      }
    }
  };
  var storeNewRows = (check) => {
    for (const [key, value] of Object.entries(check)) {
      if (key == "deleteRecords") {
        for (const row of value) {
          const operator = graphNodeList[row.tableName];
          operator.deleteRow(row.deletedItem);
        }
      } else if (key == "time") {
        localStorage.setItem(key, value);
      } else {
        const operator = graphNodeList[key];
        for (const row of value) {
          const index = operator.makeIndex(operator.identifiers, row);
          if (operator.table[index] !== void 0) {
            operator.updateRow(row);
          } else {
            operator.createRow(row);
          }
        }
      }
    }
  };
  var saveData = () => {
    for (const [key, operator] of Object.entries(graphNodeList)) {
      const obj = {};
      for (const [index, row] of Object.entries(operator.table)) {
        const newRow = {};
        for (const [item, value] of Object.entries(row)) {
          if (typeof value !== "object" || value === null) {
            newRow[item] = value;
          }
        }
        obj[index] = newRow;
      }
      localStorage.setItem(key, JSON.stringify(obj));
    }
  };

  // src/dataListenerHandlers/dataListeners/homes.js
  var homeAdd = [
    "click",
    ".tabIcon",
    (parent3, element, event) => {
      console.log("ojoijoij");
    }
  ];
  var homeDelete = [
    "dblclick",
    "li",
    (parent3, element, event) => {
      console.log("hoioiojoij");
    }
  ];

  // src/dataListenerHandlers/dataListeners/stats.js
  var sidebarEvents = ["radio", "select-one", "number", "checkbox"];
  var statChange = [
    "change",
    (element, event) => {
      if (isUpdatingFromServerState.check()) return;
      const eType = event.target.type;
      if (sidebarEvents.includes(eType)) {
        socket.emit("update", {
          table: "stats",
          name: event.target.name,
          type: event.target.type,
          value: eType == "checkbox" ? event.target.checked.toString() : event.target.value
        });
      }
    }
  ];

  // src/dataListenerHandlers/dataListeners/lists.js
  var listAdd = [
    "click",
    ".tabIcon",
    (parent3, element, event) => {
      const last = parent3.querySelector("ul").lastElementChild;
      const num = last ? parseInt(last.dataset.index) + 1 : 1;
      const result = {
        table: "lists",
        name: parent3.id,
        order: parseInt(num),
        text: "Etc...."
      };
      socket.emit("create", result);
    }
  ];
  var listEdit = [
    "dblclick",
    "li",
    (parent3, element, event) => {
      if (element.querySelector("button")) return;
      const newEntry = document.importNode(addBoxTemplate.content, true);
      const info = element.__rowReference;
      if (!info) throw Error("There is no row reference, please check again");
      const editor = rowEnter(info);
      element.replaceWith(editor);
      info.element = editor;
      editor.append(newEntry);
      editor.querySelector('button[name="Change"]').addEventListener("click", (e) => {
        const newText = editor.querySelector("textarea").value;
        socket.emit("update", {
          table: "lists",
          name: info.listName,
          order: info.listOrder,
          text: newText
        });
      });
      editor.querySelector('button[name="Delete"]').addEventListener("click", (e) => {
        if (!window.confirm("Delete Item? \n Item:" + info.listText)) {
          editor.replaceWith(info.element);
          return;
        }
        socket.emit("delete", {
          table: "lists",
          name: info.listName,
          order: info.listOrder
        });
      });
    }
  ];

  // src/dataListenerHandlers/dataListeners/characters.js
  var filterHomeValue2 = characters.querySelector('select[name="Home"]');
  var sortValue = characters.querySelector('select[name="Sort"]');
  var list = characters.querySelector("#characterTable");
  var modal2 = document.getElementById("modal");
  var characterSort = {
    "Created(Ascending)": (a, b) => {
      return a.characterCreationDate.localeCompare(b.characterCreationDate);
    },
    "Created(Descending)": (a, b) => {
      return -a.characterCreationDate.localeCompare(b.characterCreationDate);
    },
    "Latest(Ascending)": (a, b) => {
      return a.latestModified.localeCompare(b.latestModified);
    },
    "Latest(Descending)": (a, b) => {
      return -a.latestModified.localeCompare(b.latestModified);
    },
    "Name(Ascending)": (a, b) => {
      return a.characterName.localeCompare(b.characterName);
    },
    "Name(Descending)": (a, b) => {
      return -a.characterName.localeCompare(b.characterName);
    }
  };
  function mockRandomUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  var characterAdd = [
    "click",
    ".tabIcon",
    (parent3, element, event) => {
      const result = {
        table: "characters",
        id: mockRandomUUID(),
        home: `${filterHomeValue2.value !== " " ? filterHomeValue2.value : "At World's End"}`,
        name: "New Character",
        pronouns: "They/them",
        profession: "???",
        info: "Add more information here",
        traits: "Add more information here"
      };
      socket.emit("create", result);
    }
  ];
  var characterSelect = [
    "click",
    "tr",
    (parent3, element, event) => {
      const info = element.__rowReference;
      info.card = characterCard(info);
      info.card.__rowReference = info;
      if (modal2.firstChild) modal2.removeChild(modal2.firstChild);
      modal2.append(info.card);
      modal2.style.display = "block";
    }
  ];
  var characterFilterAndSort = [
    "change",
    ".filterRow",
    (parent3, element, event) => {
      const table = parent3.__graphNodeRef.table;
      const filteredCharacters = [];
      let child = list.lastElementChild;
      while (child) {
        list.removeChild(child);
        child = list.lastElementChild;
      }
      for (const [key, row] of Object.entries(table)) {
        if (filterHomeValue2.value == " " || row.characterHome == filterHomeValue2.value) {
          filteredCharacters.push(row);
        }
      }
      const eventSort = sortValue.value !== " " ? characterSort[sortValue.value] : characterSort["Created(Ascending)"];
      filteredCharacters.sort(eventSort);
      for (const character of filteredCharacters) {
        list.append(character.element);
      }
    }
  ];

  // src/dataListenerHandlers/dataListeners/characterCard.js
  var datalist = document.getElementById("homesFilter");
  var characterEdit = (parent3, element, event) => {
    const thing = parent3.firstChild;
    const info = thing.__rowReference;
    const characterForm = characterCardForm(info);
    thing.replaceWith(characterForm);
    characterForm.__rowReference = info;
  };
  var characterUpdate = (parent3, element, event) => {
    const characterForm = parent3.firstChild;
    const thing = characterLoading();
    characterForm.replaceWith(thing);
    const emitCharacterUpdate = (eventualUrl) => {
      socket.emit("update", {
        table: "characters",
        name: characterForm.querySelector('input[name="characterName"]').value,
        home: characterForm.querySelector('input[name="characterHome"]').value,
        pronouns: characterForm.querySelector('input[name="characterPronouns"]').value,
        profession: characterForm.querySelector('input[name="characterProfession"]').value,
        traits: characterForm.querySelector('input[name="characterTraits"]').value,
        info: characterForm.querySelector('textarea[class="characterInfo"]').value,
        image: eventualUrl,
        id: characterForm.__rowReference.characterId
      });
    };
    const fileInput = characterForm.querySelector('input[type="file"]');
    if (fileInput.dataset.value == characterForm.__rowReference.characterImage) {
      emitCharacterUpdate(characterForm.__rowReference.characterImage);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64String,
            characterId: characterForm.__rowReference.characterId
          })
        }).then(
          (response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Upload Failed with Response Code ${response.status}`);
            }
          }
        ).then((data) => {
          const character = "characters/" + data.fileName;
          emitCharacterUpdate(character);
        }).catch((error) => {
          console.error("Upload Error", error);
        });
      };
      const [file] = fileInput.files;
      reader.readAsDataURL(file);
    }
  };
  var characterImageChange = (parent3, element, event) => {
    const image = parent3.querySelector("img");
    const [file] = element.files;
    if (file) {
      image.src = URL.createObjectURL(file);
      element.dataset.value = file.name;
    }
  };
  var characterDelete = (parent3, element, event) => {
    const info = parent3.firstChild.__rowReference;
    if (!window.confirm("Delete Character?")) {
      return;
    }
    socket.emit("delete", {
      table: "characters",
      id: info.characterId
    });
  };
  var isValueInDatalist = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    const options = datalist.querySelectorAll("option");
    return Array.from(options).find((option) => option.value.trim().toLowerCase() === trimmedValue);
  };
  var characterHomeChange = (parent3, element, event) => {
    const finalInput = isValueInDatalist(element.value);
    if (finalInput !== void 0) element.value = finalInput.value;
    else {
      if (!window.confirm("Add Area? \n If you cannot provide a map of the area, features may not be working")) {
        element.value = "At World's End";
      } else {
        socket.emit("create", {
          table: "homes",
          name: element.value
        });
      }
    }
  };
  var characterFormClicker = {
    eventName: "click",
    actions: {
      "Edit": characterEdit,
      "Update": characterUpdate,
      "Delete": characterDelete
    }
  };
  var characterFormChanger = {
    eventName: "change",
    actions: {
      "Image": characterImageChange,
      "Homes": characterHomeChange
    }
  };

  // src/dataListenerHandlers/dataListeners/locations.js
  var locationAdd = [
    "click",
    ".tabIcon",
    (parent3, element, event) => {
      const result = {
        table: "locations",
        name: "New Location",
        id: crypto.randomUUID(),
        signifier: "?",
        info: "What is this new location?"
      };
      socket.emit("create", result);
    }
  ];
  var locationEdit = [
    "dblclick",
    ".location",
    /*
    (parent, element, event) => {
        if (element.querySelector('button')) return;
        const newEntry = document.importNode(addBoxTemplate,true);
        const info = element.__rowReference;
        if (!info) throw Error( "There is no row reference, please check again");
        const  editor = rowEnter(info) ;
        element.replaceWith(editor);
        editor.append(newEntry);
        editor.querySelector('button[name="Change"]').addEventListener('click', (e)=> {
            socket.emit( 'update', {
                table: 'lists',
                name: info.listName,
                order: info.listOrder, 
                text: editor.value
            })
        });
        editor.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
            if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original )) {
                editor.replaceWith(info.element);
                return;
            }
            socket.emit( 'delete',  {
            table: 'lists',
            name: info.listName,
            order: info.listOrder
        })
        });
    } */
    (parent3, element, event) => {
      console.log(parent3);
    }
  ];
  var locationSelect = [
    "click",
    "div",
    (parent3, element, event) => {
      console.log(parent3);
    }
  ];

  // src/dataListenerHandlers/dataListeners/markers.js
  var indicatorDragMap = /* @__PURE__ */ new Map();
  function drags(box, event) {
    let boundaries = box.getBoundingClientRect();
    let newleft = (event.clientX - event.currentTarget.offsetWidth / 2 - boundaries.left) / box.offsetWidth * 100;
    let newtop = (event.clientY - event.currentTarget.offsetHeight / 2 - boundaries.top) / box.offsetHeight * 100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop > 95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
  }
  var mapDrag = [
    "mousedown",
    ".draggable",
    (parent3, element, event) => {
      const dragHandler = (e) => drags(parent3, e);
      element.addEventListener("mousemove", dragHandler);
      indicatorDragMap.set(element, dragHandler);
    }
  ];
  var mapSet = [
    "mouseup",
    ".draggable",
    (parent3, element, event) => {
      for (const [key, value] of indicatorDragMap) {
        key.removeEventListener("mousemove", value);
        const info = key.__rowReference;
        socket.emit(
          "update",
          {
            table: "markers",
            home: info.markerHome,
            id: info.markerId,
            order: info.markerOrder,
            markerSignifier: info.markerSignifier,
            x: key.style.left,
            y: key.style.top
          }
        );
        indicatorDragMap.delete(key);
      }
    }
  ];
  var markerAdd = [
    "click",
    ".tabIcon",
    (parent3, element, event) => {
      socket.emit(
        "create",
        {
          table: "markers",
          home: "temp",
          id: "temp",
          order: "Temp",
          markerSignifier: "A",
          x: "50%",
          y: "50%"
        }
      );
    }
  ];
  var markerEdit = [
    "dblclick",
    ".meaningless",
    (parent3, element, event) => {
      console.log("Tihihih");
    }
  ];
  var markerSelect = [
    "dblclick",
    ".unmeaning",
    (parent3, element, event) => {
      console.log("htihigheiogeij");
    }
  ];

  // src/dataListenerHandlers/dataListeners/tabs.js
  var tablists = new LinkedList();
  var tabDragMap = /* @__PURE__ */ new Map();
  function displayToggle(element) {
    if (!element) return;
    if (element.style.display == "") {
      element.style.display = "flex";
      tablists.append(element);
      caltab();
    } else {
      element.style.display = "";
      tablists.popNode(element.__nodeRef.element);
    }
  }
  function drags2(event) {
    let newleft = event.clientX;
    let newtop = event.clientY;
    if (newleft < event.currentTarget.offsetWidth / 2) newleft = event.currentTarget.offsetWidth / 2;
    if (newtop < event.currentTarget.offsetHeight / 2) newtop = event.currentTarget.offsetHeight / 2;
    if (newleft > window.innerWidth - event.currentTarget.offsetWidth / 2) newleft = window.innerWidth - event.currentTarget.offsetWidth / 2;
    if (newtop > window.innerWidth - event.currentTarget.offsetHeight / 2) newtop = window.innerHeight - event.currentTarget.offsetHeight / 2;
    event.currentTarget.style.left = `${newleft}px`;
    event.currentTarget.style.top = `${newtop}px`;
  }
  function caltab() {
    let temp = tablists.head;
    let count = 10;
    while (temp != null) {
      temp.element.style.zIndex = count;
      count += 1;
      temp = temp.next;
    }
  }
  var menuToggle = [
    "click",
    "#guide",
    (parent3, element, event) => {
      const menuElement = parent3.querySelector("#menu");
      if (menuElement.style.width == "100%") {
        event.target.style.backgroundPosition = "100px 50px";
        menuElement.style.width = "0%";
        menuElement.style.overflow = "hidden";
      } else {
        event.target.style.backgroundPosition = "50px 50px";
        menuElement.style.width = "100%";
        menuElement.style.overflow = "visible";
      }
    }
  ];
  var tabToggle = [
    "click",
    ".openTab",
    (parent3, element, event) => {
      const tab = document.getElementById(element.dataset.toggle);
      if (!tab) return;
      displayToggle(tab);
    }
  ];
  var tabDrag = [
    "mousedown",
    ".tabs",
    (parent3, element, event) => {
      tablists.popNode(element.__nodeRef);
      tablists.append(element);
      caltab();
      const dragHandler = (event2) => drags2(event2);
      element.addEventListener("mousemove", dragHandler);
      tabDragMap.set(element, dragHandler);
    }
  ];
  var tabSet = [
    "mouseup",
    ".tabs",
    (parent3, element, event) => {
      for (const [key, value] of tabDragMap) {
        key.removeEventListener("mousemove", value);
      }
    }
  ];
  var modalHide = [
    "click",
    (parent3, event) => {
      if (event.target == parent3) {
        parent3.style.display = "";
      }
    }
  ];

  // src/dataListenerHandlers/dataListenerHandler.js
  var EventListenerRegistry = {
    "homeAdd": (parent3) => ContainerEventFactory(parent3, ...homeAdd),
    "homeDelete": (parent3) => ContainerEventFactory(parent3, ...homeDelete),
    "statChange": (parent3) => GenericEventFactory(parent3, ...statChange),
    "listAdd": (parent3) => ContainerEventFactory(parent3, ...listAdd),
    "listEdit": (parent3) => ContainerEventFactory(parent3, ...listEdit),
    "characterCard": (parent3) => ClickContainerFactory(parent3, characterFormClicker),
    "characterChange": (parent3) => ClickContainerFactory(parent3, characterFormChanger),
    "characterAdd": (parent3) => ContainerEventFactory(parent3, ...characterAdd),
    "characterSelect": (parent3) => ContainerEventFactory(parent3, ...characterSelect),
    "characterArrange": (parent3) => ContainerEventFactory(parent3, ...characterFilterAndSort),
    "locationAdd": (parent3) => ContainerEventFactory(parent3, ...locationAdd),
    "locationEdit": (parent3) => ContainerEventFactory(parent3, ...locationEdit),
    "locationSelect": (parent3) => ContainerEventFactory(parent3, ...locationSelect),
    "markerAdd": (parent3) => ContainerEventFactory(parent3, ...markerAdd),
    "markerEdit": (parent3) => ContainerEventFactory(parent3, ...markerEdit),
    "markerSelect": (parent3) => ContainerEventFactory(parent3, ...markerSelect),
    "mapDrag": (parent3) => ContainerEventFactory(parent3, ...mapDrag),
    "mapSet": (parent3) => ContainerEventFactory(parent3, ...mapSet),
    "tabToggle": (parent3) => ContainerEventFactory(parent3, ...tabToggle),
    "menuToggle": (parent3) => ContainerEventFactory(parent3, ...menuToggle),
    "tabDrag": (parent3) => ContainerEventFactory(parent3, ...tabDrag),
    "tabSet": (parent3) => ContainerEventFactory(parent3, ...tabSet),
    "modalHide": (parent3) => GenericEventFactory(parent3, ...modalHide)
  };
  function ContainerEventFactory(parent3, mEvent, selector, handler) {
    parent3.addEventListener(mEvent, (e) => {
      const element = e.target.closest(selector);
      if (!element) return;
      handler(parent3, element, e);
    });
  }
  function GenericEventFactory(element, rEvent, handler) {
    element.addEventListener(rEvent, (e) => {
      handler(element, e);
    });
  }
  function ClickContainerFactory(element, clicker) {
    const { eventName, actions } = clicker;
    element.addEventListener(eventName, (e) => {
      console.log(eventName);
      const button = e.target.closest("[data-action]");
      console.log(button);
      if (!button) return;
      const handler = actions[button.dataset.action];
      if (!handler) {
        console.log(`action ${button.dataset.action} doesn't exist! Please add`);
        return;
      }
      handler(element, button, e);
    });
  }
  var dataListenerHandler = () => {
    const entryPoints = document.querySelectorAll("[data-listener]");
    entryPoints.forEach((entryPoint) => {
      const eventListeners = entryPoint.dataset.listener.split(" ");
      eventListeners.forEach((eventListener) => {
        EventListenerRegistry[eventListener](entryPoint);
      });
    });
  };

  // src/start.js
  dataHandlers();
  dataListenerHandler();
  socket.on("connect", () => {
    let check = localStorage.getItem("time") || 0;
    socket.emit("checkSync", check);
  });
  socket.on("create", (create) => {
    graphNodeList[create.table].createRow(create.result);
  });
  socket.on("update", (update) => {
    isUpdatingFromServerState.stepUp();
    console.log(update.table);
    graphNodeList[update.table].updateRow(update.result);
    isUpdatingFromServerState.stepDown();
  });
  socket.on("delete", (deleted) => {
    graphNodeList[deleted.tableName].deleteRow(deleted.deletedItem);
  });
  socket.on("checkSync", (check) => {
    storeNewRows(check);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      console.log("Ending session, saving data locally");
      saveData();
    }
  });
})();
//# sourceMappingURL=bundle.js.map
