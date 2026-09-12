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
  var makeIndex = (requirements, row) => {
    const index = requirements.map((item) => row[item]).join("/%/");
    return index;
  };
  var graphNode = class {
    constructor(name, identifiers, children, onDelete7, createOperator, updateOperator, deleteOperator, attachElement) {
      this.table = {};
      this.name = name;
      this.identifiers = identifiers;
      this.children = children;
      this.onDelete = onDelete7;
      this.createOperator = createOperator;
      this.updateOperator = updateOperator;
      this.deleteOperator = deleteOperator;
      if (attachElement) {
        this.attachElement = document.getElementById(attachElement);
        this.attachElement.__graphNodeRef = this;
      }
    }
    createRow(row) {
      const index = makeIndex(this.identifiers, row);
      const element = this.createOperator(row);
      element.__rowReference = row;
      row.element = element;
      this.table[index] = row;
      updateIndicate(element);
    }
    updateRow(updateValue) {
      const index = makeIndex(this.identifiers, updateValue);
      const row = this.table[index];
      if (!row) throw Error(`${row} does not exist!`);
      for (const [key, value] of Object.entries(updateValue)) {
        row[key] = value;
      }
      const element = this.updateOperator(row);
      element.__rowReference = row;
      row.element = element;
      updateIndicate(row.element);
    }
    deleteRow(deletedItem) {
      const row = this.table[deletedItem];
      if (!row) return;
      if (row.latestModified > deletedItem.deletedAt) return;
      this.deleteOperator(row);
      if (this.children) {
        for (const children of this.children) {
          children.deleteCascader(row);
        }
      }
      ;
      delete this.table[deletedItem];
    }
    deleteCascader(upStreamRow) {
      if (this.onDelete.action == "setDefault") {
        for (const [key, row] of Object.entries) {
          if (row[this.onDelete.key] == upStreamRow[this.onDelete.reference]) {
            row[this.onDelete.key] = this.onDelete.default;
          }
        }
      } else {
        for (const [key, row] of Object.entries) {
          if (key.startsWith(upStreamRow)) this.deleteRow(key);
        }
      }
    }
  };
  var filehelper = (folder, filename, fileInput, fileEmitFunction) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: folder,
          image: base64String,
          filename
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
        const character = folder + "/" + data.fileName;
        fileEmitFunction(character);
      }).catch((error) => {
        console.error("Upload Error", error);
      });
    };
    const [file] = fileInput.files;
    reader.readAsDataURL(file);
  };

  // src/dataHandler/data/charactersHandler.js
  var characterTable = characters.querySelector("#characterTable");
  var modal = document.getElementById("modal");
  var filterHomeValue = characters.querySelector('select[name="Home"]');
  var onDelete = {
    action: "setDefault",
    key: "characterHome",
    reference: "homeName",
    default: 1
  };
  var characterCreateOperator = (row) => {
    const characterElement = characterRow(row);
    if (filterHomeValue.value == row.characterHome || filterHomeValue.value === "null") characterTable.append(characterElement);
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
    [],
    onDelete,
    characterCreateOperator,
    characterUpdateOperator,
    characterDeleteOperator,
    "characters"
  );

  // src/injects/homes.js
  var newHome = (row) => {
    return stringToHTML(`
    <li data-click="Select" id="${row.homeName}"> ${row.homeName}
    </li>
    `);
  };
  var newSelectionHome = (row) => {
    return stringToHTML(
      `
        <option value="${row.homeId}">${row.homeName} </option>
        `
    );
  };
  var homeCardForm = (row) => {
    return stringToHTML(`
    <div class = "house">
        <div class="Headers">
            <h4> 
            <input type="text" name="homeName" value="${row.homeName}"> 
            </h4>
            <button data-click="Update" type="button" name="Submit"> Submit </button>
            <button data-click="Delete" type="button" name="Delete"> Delete </button>
        </div>
        <div class="mapCards">
            <label for="HomeFileInput">
            <img src="${row.homeImage}" alt="Oops">
            </label>
        </div>
        <input type="text" name="homeTagLine" value="${row.homeTagLine}">
        <input id="HomeFileInput"type='file' accept="image/*" class="characterImageInput" data-change="Image" data-value="${row.homeImage}">
        </div>
    </div>    
    `);
  };
  var homeCard = (row) => {
    return stringToHTML(`
    <div class="house">
        <div class="Headers">
            <h4>${row.homeName} </h4>
            <h4 data-click="Edit" class="tabIcon">&#x270D</h4>
        </div>
        <div class="mapCards">
            <img src="${row.homeImage}" alt="Oops"> 
            ${row.homeImage != "maps/Mystery.png" ? `<h4 data-click="Go" class="GoTo"> Go &#8608</h4>` : ""}
        </div>           
        <div class="homeTagLine">${row.homeTagLine} </div>
    </div>
    `);
  };

  // src/dataHandler/data/homesHandler.js
  var homeCardLocation = document.querySelector("#extra");
  var homeTab = document.getElementById("worldMaps");
  var worldMap = homeTab.querySelector("ul");
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
    if (row.card) {
      row.card = homeCard(row);
      row.card.__rowReference = row;
      if (homeTab.dataset.selected == row.homeId) {
        homeCardLocation.removeChild(homeCardLocation.firstChild);
        homeCardLocation.append(row.card);
      }
    }
    row.element.replaceWith(newHomeElement);
    return newHomeElement;
  };
  var homesDeleteOperator = (row) => {
    const removal = row.element.__selectionReference;
    removal.forEach((element) => {
      element.remove();
    });
    if (row.card) {
      if (homeTab.dataset.selected == row.homeId) {
        homeCardLocation.removeChild(homeCardLocation.firstChild);
        homeTab.classList.remove("expanded");
        homeTab.dataset.selected = "noneAtTheMoment";
      }
    }
    row.element.remove();
  };
  var onDelete2 = {
    action: "Cascade"
  };
  var homeNode = new graphNode(
    "homes",
    ["homeId"],
    [locationNode, characterNode],
    onDelete2,
    homesCreateOperator,
    homesUpdateOperator,
    homesDeleteOperator,
    "worldMaps"
  );
  var getHomeName = (id) => {
    return homeNode.table[id].homeName;
  };
  var getHomeId = (name) => {
    for (const [key, row] of Object.entries(homeNode.table)) {
      if (row.homeName == name) {
        return key;
      }
    }
    throw Error(`This home does not exist! Home: ${name}`);
  };

  // src/injects/characters.js
  var characterRow = (row) => {
    const charRow = stringToHTMLTable(`
        <tr data-click="Select">
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
        <label for="CharacterFileInput${row.characterId}">
        <img src="${row.characterImage}" alt="">
        </label>
        <input type='file' accept="image/*" class="characterImageInput" id="CharacterFileInput${row.characterId}" data-change="Image" data-value="${row.characterImage}"> <table>
            <tbody>
                <tr> <td>Name: </td> <td><input type="text" name="characterName" value="${row.characterName}"></td></tr>
                <tr> <td>Pronouns: </td> <td><input type="text" name="characterPronouns" value="${row.characterPronouns}"></td></tr>
                <tr> <td>Profession: </td> <td><input type="text" name="characterProfession" value="${row.characterProfession}"></td></tr>
                <tr> <td>Home: </td> <td><input data-change="Homes" data-homeName=${row.characterHome} type="text" list="homesFilter" name="characterHome" value="${getHomeName(row.characterHome)}"></td></tr>
                <tr> <td>Traits: </td> <td><input type="text" name="characterTraits" value="${row.characterTraits}"></td></tr>
            </tbody>
        </table>
    </div>
    <div class="CharacterInfo">
        <h2> History </h2>
        <textarea class="characterInfo">${row.characterInfo}</textarea>
        <button data-click="Update" type="button" name="Submit"> Submit </button>
        <button data-click="Delete" type="button" name="Delete"> Delete </button>
    </div>       
</div>`);
  };
  var characterCard = (row) => {
    return stringToHTML(`
<div class="characterCard">
    <div class="Infodeck">
        <img class="Portrait" src="${row.characterImage}" alt="">
        <div class="Headers">
            <h3>${row.characterName} </h3> 
            <div class="characterPronouns"> (${row.characterPronouns}) </div>
        </div>
        <table>
            <tbody>
                <tr> <td>Home: </td> <td data-homeName='${row.characterHome}'>${getHomeName(row.characterHome)}</td></tr>
                <tr> <td>Profession: </td> <td>${row.characterProfession}</td></tr>
                <tr> <td>Traits: </td> <td>${row.characterTraits}</td></tr>
            </tbody>
        </table>
    </div>
    <div class="characterNotes">
        <div class="Headers">
            <h2> History </h2>
            <h2 data-click="Edit" class="tabIcon">&#x270D</h2>
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
  var onDelete3 = {
    action: "Cascade"
  };
  var locationNode = new graphNode(
    "location",
    ["locationName", "locationId"],
    [markerNode],
    onDelete3,
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
  var onDelete4 = {
    action: "Cascade"
  };
  var markerNode = new graphNode(
    "markers",
    ["markerName", "markerId", "markerOrder", "markerSignifier"],
    [],
    onDelete4,
    markerCreateOperator,
    markersUpdateOperator,
    markerDeleteOperator
  );

  // src/injects/stats.js
  var radio = (name, style, options) => {
    const elementString = `
    <div class="radioContainer">
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
  var onDelete5 = {
    action: "Cascade"
  };
  var statNode = new graphNode(
    "stats",
    ["statName"],
    [],
    onDelete5,
    statsCreateOperator,
    statsUpdateOperator,
    statsDeleteOperator
  );

  // src/injects/lists.js
  var listsRow = (index, text) => {
    const elementString = `
        <li data-dblclick="Edit" data-index=${index}>
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
  var onDelete6 = {
    action: "Cascade"
  };
  var listNode = new graphNode(
    "lists",
    ["listName", "listOrder"],
    [],
    onDelete6,
    listsOperator,
    listsUpdateOperator,
    listsDeleteOperator
  );

  // src/dataHandler/syncHandler.js
  var graphNodeList = {
    "homes": homeNode,
    "characters": characterNode,
    "stats": statNode,
    "lists": listNode,
    "locations": locationNode,
    "markers": markerNode
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
          const index = makeIndex(operator.identifiers, row);
          if (operator.table[index] !== void 0) {
            const final = {
              prev: {},
              next: {}
            };
            for (const [key2, value2] of Object.entries(row)) {
              if (operator.table[index][key2] !== value2) {
                final.prev[key2] = operator.table[index][key2];
                final.next[key2] = value2;
              }
            }
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
  var homeCardLocation2 = document.querySelector("#extra");
  var mapImage = document.querySelector("#map img");
  var homeAdd = (element, event) => {
    const last = event.currentTarget.querySelector("ul").lastElementChild;
    if (window.confirm("Add new site?")) {
      const result = {
        table: "homes",
        homeName: "..."
      };
      socket.emit("create", result);
    }
  };
  var homeSelect = (element, event) => {
    const parentData = event.currentTarget.dataset;
    const info = element.__rowReference;
    info.card = homeCard(info);
    info.card.__rowReference = info;
    if (parentData.selected == info.homeId) {
      homeCardLocation2.removeChild(homeCardLocation2.firstChild);
      event.currentTarget.classList.remove("expanded");
      parentData.selected = "noneAtTheMoment";
    } else {
      if (parentData.selected != "noneAtTheMoment") {
        homeCardLocation2.removeChild(homeCardLocation2.firstChild);
      }
      event.currentTarget.classList.add("expanded");
      homeCardLocation2.append(info.card);
      parentData.selected = info.homeId;
    }
  };
  var homeEdit = (element, event) => {
    const thing = homeCardLocation2.firstChild;
    const info = thing.__rowReference;
    const homeForm2 = homeCardForm(info);
    thing.replaceWith(homeForm2);
    homeForm2.__rowReference = info;
  };
  var homeMapChange = (element, event) => {
    const image = homeCardLocation2.querySelector("img");
    const [file] = element.files;
    if (file) {
      image.src = URL.createObjectURL(file);
      element.dataset.value = file.name;
      if (file.size > 5 * 1024 * 1024) {
        window.alert("This file is too large for actual upload. Please keep the size of the image >5mb to actually update this.");
      }
    }
  };
  var homeUpdate = (element, event) => {
    const homeForm2 = homeCardLocation2.firstChild;
    const formGet = (name) => homeForm2.querySelector(`input[name="${name}"]`).value;
    const emitHomeUpdate = (eventualUrl) => {
      socket.emit("update", {
        table: "homes",
        homeId: homeForm2.__rowReference.homeId,
        homeName: formGet("homeName"),
        homeTagline: formGet("homeTagLine"),
        homeImage: eventualUrl
      });
    };
    const fileInput = homeForm2.querySelector('input[type="file"]');
    if (fileInput.dataset.value == homeForm2.__rowReference.homeImage) {
      emitHomeUpdate(homeForm2.__rowReference.homeImage);
    } else {
      filehelper("maps", homeForm2.__rowReference.homeId, fileInput, emitHomeUpdate);
    }
  };
  var homeDelete = (element, event) => {
    const info = homeCardLocation2.firstChild.__rowReference;
    if (!window.confirm("Delete Character?")) {
      return;
    }
    socket.emit("delete", {
      table: "home",
      characterId: info.homeId
    });
  };
  var homeGoTo = (element, event) => {
    const info = element.closest(".house").__rowReference;
    if (info.homeImage == "") {
      window.alert("There is no map to go to");
      return;
    } else {
      console.log(info.homeImage);
      mapImage.src = info.homeImage;
    }
  };
  var homeForm = {
    "click": {
      "Add": homeAdd,
      "Edit": homeEdit,
      "Go": homeGoTo,
      "Select": homeSelect,
      "Update": homeUpdate,
      "Delete": homeDelete
    },
    "change": {
      "Image": homeMapChange
    }
  };

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
          statName: event.target.name,
          statType: event.target.type,
          statValue: eType == "checkbox" ? event.target.checked.toString() : event.target.value
        });
      }
    }
  ];

  // src/dataListenerHandlers/dataListeners/lists.js
  var listAdd = (element, event) => {
    const result = {
      table: "lists",
      listName: event.currentTarget.id,
      listText: "Etc...."
    };
    socket.emit("create", result);
  };
  var listEdit = (element, event) => {
    if (element.querySelector("button")) return;
    const newEntry = document.importNode(addBoxTemplate.content, true);
    const info = element.__rowReference;
    if (!info) throw Error("There is no row reference, please check again");
    const editor = rowEnter(info);
    element.replaceWith(editor);
    info.element = editor;
    editor.__rowReference = info;
    editor.append(newEntry);
  };
  var listChange = (element, event) => {
    const editor = event.target.closest("li");
    const newText = editor.querySelector("textarea").value;
    const info = editor.__rowReference;
    socket.emit("update", {
      table: "lists",
      listName: info.listName,
      listOrder: info.listOrder,
      listText: newText
    });
  };
  var listDelete = (element, event) => {
    const info = event.target.closest("li").__rowReference;
    if (!window.confirm("Delete Item? \n Item:" + info.listText)) {
      return;
    }
    socket.emit("delete", {
      table: "lists",
      listName: info.listName,
      listOrder: info.listOrder
    });
  };
  var listCard = {
    "click": {
      "Add": listAdd,
      "Change": listChange,
      "Delete": listDelete
    },
    "dblclick": {
      "Edit": listEdit
    }
  };

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
  var characterAdd = (element, event) => {
    const result = {
      table: "characters",
      characterHome: `${filterHomeValue2.value !== "null" ? filterHomeValue2.value : 1}`,
      characterName: "New Character",
      characterPronouns: "They/them",
      characterProfession: "???",
      characterInfo: "Add more information here",
      characterTraits: "Add more information here"
    };
    socket.emit("create", result);
  };
  var characterSelect = (element, event) => {
    const info = element.__rowReference;
    info.card = characterCard(info);
    info.card.__rowReference = info;
    if (modal2.firstChild) modal2.removeChild(modal2.firstChild);
    modal2.append(info.card);
    modal2.style.display = "block";
  };
  var characterFilterAndSort = (element, event) => {
    const table = event.currentTarget.__graphNodeRef.table;
    const filteredCharacters = [];
    let child = list.lastElementChild;
    while (child) {
      list.removeChild(child);
      child = list.lastElementChild;
    }
    for (const [key, row] of Object.entries(table)) {
      if (filterHomeValue2.value === "null" || row.characterHome == filterHomeValue2.value) {
        filteredCharacters.push(row);
      }
    }
    const eventSort = sortValue.value !== " " ? characterSort[sortValue.value] : characterSort["Created(Ascending)"];
    filteredCharacters.sort(eventSort);
    for (const character of filteredCharacters) {
      list.append(character.element);
    }
  };
  var characterList = {
    "click": {
      "Add": characterAdd,
      "Select": characterSelect
    },
    "change": {
      "FilterSort": characterFilterAndSort
    }
  };

  // src/dataListenerHandlers/dataListeners/characterCard.js
  var datalist = document.getElementById("homesFilter");
  var characterEdit = (element, event) => {
    const thing = event.currentTarget.firstChild;
    const info = thing.__rowReference;
    const characterForm2 = characterCardForm(info);
    thing.replaceWith(characterForm2);
    characterForm2.__rowReference = info;
  };
  var characterUpdate = (element, event) => {
    const characterForm2 = event.currentTarget.firstChild;
    const thing = characterLoading();
    characterForm2.replaceWith(thing);
    const emitCharacterUpdate = (eventualUrl) => {
      socket.emit("update", {
        table: "characters",
        characterName: characterForm2.querySelector('input[name="characterName"]').value,
        characterHome: getHomeId(characterForm2.querySelector('input[name="characterHome"]').value),
        characterPronouns: characterForm2.querySelector('input[name="characterPronouns"]').value,
        characterProfession: characterForm2.querySelector('input[name="characterProfession"]').value,
        characterTraits: characterForm2.querySelector('input[name="characterTraits"]').value,
        characterInfo: characterForm2.querySelector('textarea[class="characterInfo"]').value,
        characterImage: eventualUrl,
        characterId: characterForm2.__rowReference.characterId
      });
    };
    const fileInput = characterForm2.querySelector('input[type="file"]');
    if (fileInput.dataset.value == characterForm2.__rowReference.characterImage) {
      emitCharacterUpdate(characterForm2.__rowReference.characterImage);
    } else {
      filehelper("characters", characterForm2.__rowReference.characterId, fileInput, emitCharacterUpdate);
    }
  };
  var characterImageChange = (element, event) => {
    const image = event.currentTarget.querySelector("img");
    const [file] = element.files;
    if (file) {
      image.src = URL.createObjectURL(file);
      element.dataset.value = file.name;
      if (file.size > 5 * 1024 * 1024) {
        window.alert("This file is too large for actual upload. Please keep the size of the image >5mb to actually update this.");
      }
    }
  };
  var characterDelete = (element, event) => {
    const info = event.currentTarget.firstChild.__rowReference;
    if (!window.confirm("Delete Character?")) {
      return;
    }
    console.log(info);
    socket.emit("delete", {
      table: "characters",
      characterId: info.characterId
    });
  };
  var isValueInDatalist = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    const options = datalist.querySelectorAll("option");
    return Array.from(options).find((option) => option.value.trim().toLowerCase() === trimmedValue);
  };
  var characterHomeChange = (element, event) => {
    const finalInput = isValueInDatalist(element.value);
    if (finalInput !== void 0) element.value = finalInput.value;
    else {
      if (!window.confirm("Add Area? \n If you cannot provide a map of the area, features may not be working")) {
        element.value = "At World's End";
      } else {
        socket.emit("create", {
          table: "homes",
          homeName: element.value
        });
      }
    }
  };
  var characterForm = {
    "click": {
      "Edit": characterEdit,
      "Update": characterUpdate,
      "Delete": characterDelete
    },
    "change": {
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
          markHome: "temp",
          markerId: "temp",
          markerOrder: "Temp",
          markerSignifier: "A",
          markerX: "50",
          markerY: "50"
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
  function drags2(event, offsetX, offsetY) {
    let newleft = event.pageX - offsetX;
    let newtop = event.pageY - offsetY;
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
  var menuToggle = (element, event) => {
    const menuElement = event.currentTarget.querySelector("#menu");
    if (menuElement.style.width == "100%") {
      event.target.style.backgroundPosition = "100px 50px";
      menuElement.style.width = "1%";
      menuElement.style.overflow = "hidden";
    } else {
      event.target.style.backgroundPosition = "50px 50px";
      menuElement.style.width = "100%";
    }
  };
  var tabToggle = (element, event) => {
    const tab = document.getElementById(element.dataset.toggle);
    if (!tab) return;
    displayToggle(tab);
  };
  var tabDrag = [
    "mousedown",
    ".tabs",
    (parent3, element, event) => {
      tablists.popNode(element.__nodeRef);
      tablists.append(element);
      caltab();
      const offsetX = event.clientX - element.offsetLeft;
      const offsetY = event.clientY - element.offsetTop;
      const dragHandler = (moveEvent) => drags2(moveEvent, offsetX, offsetY);
      element.addEventListener("mousemove", dragHandler);
      const cleanup = () => {
        element.removeEventListener("mousemove", dragHandler);
        document.removeEventListener("mouseup", cleanup);
      };
      document.addEventListener("mouseup", cleanup);
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
  var menuCard = {
    "click": {
      "MenuToggle": menuToggle,
      "TabToggle": tabToggle
    }
  };

  // src/dataListenerHandlers/dataListenerHandler.js
  var EventListenerRegistry = {
    "statChange": (parent3) => GenericEventFactory(parent3, ...statChange),
    "homeForm": (parent3) => EventContainerFactory(parent3, homeForm),
    "listCard": (parent3) => EventContainerFactory(parent3, listCard),
    "characterCard": (parent3) => EventContainerFactory(parent3, characterForm),
    "characterList": (parent3) => EventContainerFactory(parent3, characterList),
    "locationAdd": (parent3) => ContainerEventFactory(parent3, ...locationAdd),
    "locationEdit": (parent3) => ContainerEventFactory(parent3, ...locationEdit),
    "locationSelect": (parent3) => ContainerEventFactory(parent3, ...locationSelect),
    "markerAdd": (parent3) => ContainerEventFactory(parent3, ...markerAdd),
    "markerEdit": (parent3) => ContainerEventFactory(parent3, ...markerEdit),
    "markerSelect": (parent3) => ContainerEventFactory(parent3, ...markerSelect),
    "mapDrag": (parent3) => ContainerEventFactory(parent3, ...mapDrag),
    "mapSet": (parent3) => ContainerEventFactory(parent3, ...mapSet),
    "menuCard": (parent3) => EventContainerFactory(parent3, menuCard),
    "tabDrag": (parent3) => ContainerEventFactory(parent3, ...tabDrag),
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
  function EventContainerFactory(element, container) {
    for (const [eventName, actions] of Object.entries(container)) {
      element.addEventListener(eventName, (e) => {
        const button = e.target.closest(`[data-${eventName}]`);
        if (!button) return;
        const handler = actions[button.dataset[eventName]];
        if (!handler) {
          console.log(`action ${button.dataset[eventName]} doesn't exist! Please add`);
          return;
        }
        handler(button, e);
      });
    }
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
  var makeLatest = (thing) => {
    localStorage.setItem("time", thing);
  };
  socket.on("connect", () => {
    let check = localStorage.getItem("time") || 0;
    socket.emit("checkSync", check);
  });
  socket.on("create", (create) => {
    graphNodeList[create.table].createRow(create.result);
    makeLatest(create.result.latestModified);
  });
  socket.on("update", (update) => {
    isUpdatingFromServerState.stepUp();
    graphNodeList[update.table].updateRow(update.result);
    makeLatest(update.result.latestModified);
    isUpdatingFromServerState.stepDown();
  });
  socket.on("delete", (deleted) => {
    console.log(deleted);
    graphNodeList[deleted.tableName].deleteRow(deleted.deletedItem);
    makeLatest(deleted.deletedAt);
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
