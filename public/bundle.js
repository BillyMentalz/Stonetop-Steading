(() => {
  // src/document.js
  var socket = io();
  var templates = document.getElementById("templates");
  var sidebar = document.getElementById("sidebar");
  var topbar = document.getElementById("topbar");
  var guide = document.getElementById("guide");
  var map = document.getElementById("map");
  var guidebook = document.getElementById("guide");
  var menu = document.getElementById("menu");
  var maps = document.getElementById("worldMaps");
  var characters = document.getElementById("characters");
  var locations = document.getElementById("locations");
  var assets = document.getElementById("assets");
  var addBox = document.getElementById("addBox");
  var characterInfo = document.getElementById("characterInfo");
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

  // src/dataHandler/homesHandler.js
  var homesOperator = (key, value) => {
    const element = document.createElement("div");
    element.classList.add("S");
    element.textContent = key;
    element.id = key;
    maps.appendChild(element);
    return element;
  };
  var homesUpdateOperator = (key, value) => {
    const element = maps.querySelector(`[id="${key}"]`);
    element.textContent = key;
    return element;
  };
  var homesDeleteOperator = (key, value) => {
    const element = maps.getElementById(key);
    console.log(element);
    element.remove();
  };

  // src/dataHandler/statsHandler.js
  var statsOperator = (key, value) => {
    let element = null;
    switch (value.statType) {
      case "radio":
        element = document.querySelector(`[name="${key}"][value="${value.statValue}"]`);
        element.checked = true;
        break;
      case "select-one":
        element = document.querySelector(`[name="${key}"]`);
        element.value = value.statValue;
        break;
      case "number":
        element = document.querySelector(`[name="${key}"]`);
        element.value = value.statValue;
        break;
      case "checkbox":
        element = document.querySelector(`[name=${key}]`);
        element.checked = value.statValue === "true";
        break;
    }
    return element;
  };

  // src/dataHandler/listsHandler.js
  var listsOperator = (key, value) => {
    const listIndex = key.split("/%/");
    const parent = document.querySelector(`ul#${listIndex[0]}`);
    let listElement = document.createElement("li");
    let spanElement = document.createElement("span");
    spanElement.textContent = value.listText;
    spanElement.dataset.field = "listText";
    listElement.append(spanElement);
    listElement.dataset.index = listIndex[1];
    listElement.dataset.editable = "lists";
    listElement.id = key;
    parent.append(listElement);
    return listElement;
  };
  var listsUpdateOperator = (key, value) => {
    const listIndex = key.split("/%/");
    const listElement = document.getElementById(key);
    let para = listElement.querySelector("[data-field]");
    let spanElement = document.createElement("span");
    spanElement.textContent = value.listText;
    spanElement.dataset.field = "listText";
    para.replaceWith(spanElement);
    return listElement;
  };
  var listsDeleteOperator = (key) => {
    const listElement = document.getElementById(key);
    listElement.remove();
  };

  // src/dataHandler/charactersHandler.js
  var tableShown = ["characterName", "characterOccupation", "characterTraits"];
  var characterTable = characters.querySelector("#characterTable");
  var charactersOperator = (key, value) => {
    let characterElement = document.createElement("tr");
    characterElement.dataset.id = key;
    for (const [head, data] of Object.entries(value)) {
      const tabdata = document.createElement("td");
      tabdata.dataset.head = head;
      tabdata.textContent = data;
      tabdata.style.display = tableShown.includes(head) ? "flex" : "none";
      characterElement.append(tabdata);
    }
    characterTable.append(characterElement);
    return characterElement;
  };
  var charactersUpdateOperator = (key, value) => {
    const characterElement = document.querySelector(`[data-id="${key}"]`);
    for (const [head, data] of Object.entries(value)) {
      const tabdata = characterElement.querySelector(`[data-head="${head}"]`);
      tabdata.textContent = data;
    }
    ;
    return characterElement;
  };
  var charactersDeleteOperator = (key) => {
    const characterElement = document.querySelector(`[data-id="${key}"]`);
    characterElement.remove();
  };

  // src/animation.js
  var indicateTimers = /* @__PURE__ */ new Map();
  var tablists = new LinkedList();
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

  // src/syncHandler.js
  var graphNode = class {
    constructor(name, identifiers, children, createOperator, updateOperator2, deleteOperator) {
      this.name = name;
      this.identifiers = identifiers;
      this.table = {};
      this.children = children;
      this.createOperator = createOperator;
      this.updateOperator = updateOperator2;
      this.deleteOperator = deleteOperator;
    }
    convertRow(row) {
      const formattedRow = this.identifiers.map((item) => {
        const element = row[item];
        delete row[item];
        return element;
      });
      const index = formattedRow.join("/%/");
      return { index, row };
    }
    createRow(value) {
      const formattedRow = this.convertRow(value);
      const element = this.createOperator(formattedRow.index, formattedRow.row);
      this.table[formattedRow.index] = formattedRow.row;
      updateIndicate(element);
    }
    updateRow(value) {
      const formattedRow = this.convertRow(value);
      const element = this.updateOperator(formattedRow.index, formattedRow.row);
      this.table[formattedRow.index] = formattedRow.row;
      updateIndicate(element);
      for (const thing of this.cascade) {
        thing.updateCascade(formattedRow.index, formattedRow.row);
      }
    }
    updateCascade(id, row) {
      for (const [key, value] of Object.entries(this.table)) {
        if (key.startsWith(id)) {
          for (const [subkey, subvalue] of Object.entries(row)) {
            value[subkey] = row[subkey];
          }
          const element = this.updateOperator({ index: key, row: value });
          updateIndicate(element);
        }
      }
    }
    deleteRow(deletedItem) {
      delete this.table[deletedItem];
      this.deleteOperator(deletedItem);
      for (const thing of this.cascade) {
        thing.deleteCascade(deletedItem);
      }
    }
    deleteCascade(id) {
      for (const [key, value] of Object.entries(this.table)) {
        if (key.startsWith(id)) {
          this.deleteRow(key);
        }
      }
    }
  };
  var markerNode = graphNode("markers", ["markerHome", "markerId", "markerOrder"], {}, markersOperator, markersUpdateOperator, markersDeleteOperator);
  var locationNode = graphNode("locations", ["locationHome", "locationId"], { markerNode }, locationsOperator, locationsUpdateOperator, locationsDeleteOperator);
  var characterNode = graphNode("characters", ["characterId"], {}, charactersOperator, charactersUpdateOperator, charactersDeleteOperator);
  var listNode = graphNode("lists", ["listName", "listOrder"], {}, listsOperator, listsUpdateOperator, listsDeleteOperator);
  var statNode = graphNode("stats", ["statName"], {}, statsOperator, statsOperator, statsOperator);
  var homeNode = graphNode("homes", ["homeName"], { characterNode, locationNode }, homesOperator, homesUpdateOperator, homesDeleteOperator);
  var loadTable = {
    "homes": homesOperator,
    "stats": statsOperator,
    "lists": listsOperator,
    "characters": charactersOperator
    //   'locations': locationsSync,
    //    'markers': markersSync 
  };
  var updateTable = {
    "homes": homesUpdateOperator,
    "stats": statsOperator,
    "lists": listsUpdateOperator,
    "characters": charactersUpdateOperator
    //'locations': 
    //'markers': 
  };
  var deleteTable = {
    "homes": homesDeleteOperator,
    //'stats': statsOperator,
    "lists": listsDeleteOperator,
    "characters": charactersDeleteOperator
    // 'locations'
    // 'markers'
  };
  var loadOperator = (create) => {
    const [key, value] = Object.entries(create)[0];
    localStorage.setItem("time", value.latestModified);
    const sum = convertRow(convertTable[key], value);
    const log = JSON.parse(localStorage.getItem(key));
    const element = loadTable[key](sum.index, sum.row);
    log[sum.index] = sum.row;
    localStorage.setItem(key, JSON.stringify(log));
    updateIndicate(element);
  };
  var updateOperator = (update) => {
    console.log(update);
    const [key, value] = Object.entries(update)[0];
    localStorage.setItem("time", value.latestModified);
    const sum = convertRow(convertTable[key], value);
    const log = JSON.parse(localStorage.getItem(key));
    const element = updateTable[key](sum.index, sum.row);
    log[sum.index] = sum.row;
    localStorage.setItem(key, JSON.stringify(log));
    updateIndicate(element);
  };
  var convertTable = {
    "homes": ["homeName"],
    "stats": ["statName"],
    "lists": ["listName", "listOrder"],
    "characters": ["characterId"],
    "locations": ["locationHome", "locationSignifier"],
    "markers": ["markerHome", "markerSignifier", "markerOrder"]
  };
  var loadTables = () => {
    for (const [key, value] of Object.entries(loadTable)) {
      const payload = JSON.parse(localStorage.getItem(key)) || {};
      for (const [key1, value1] of Object.entries(payload)) {
        value(key1, value1);
      }
    }
  };
  var convertRow = (identifiers, row) => {
    let pendings = [];
    const unique = identifiers.map((identifier) => {
      const element = row[identifier];
      delete row[identifier];
      return element;
    });
    const index = unique.join("/%/");
    return { index, row };
  };
  var storeNewRows = (check) => {
    for (const [key, value] of Object.entries(check)) {
      if (key == "deleteRecords") {
        deleteOperation(value);
      } else if (key == "time") {
        localStorage.setItem(key, value);
      } else {
        var current = JSON.parse(localStorage.getItem(key)) || {};
        value.forEach((row) => {
          const add = convertRow(convertTable[key], row);
          const action = current.hasOwnProperty(add.index);
          const element = action ? updateTable[key](add.index, add.row) : loadTable[key](add.index, add.row);
          updateIndicate(element);
          current[add.index] = add.row;
        });
        localStorage.setItem(key, JSON.stringify(current));
      }
    }
  };
  var deleteOperation = (deletion) => {
    deletion.forEach((del) => {
      let store = null;
      let marks = null;
      localStorage.setItem("time", del.deletedAt);
      switch (del.tableName) {
        case "homes":
          localStorage.clear();
          location.reload();
          break;
        // case 'stats': break;
        case "location":
          store = JSON.parse(localStorage.getItem("location")) || {};
          marks = JSON.parse(localStorage.getItem("markers")) || {};
          let newmarks = {};
          for (const [key, value] of Object.entries(marks)) {
            if (!key.startsWith(del.deletedItem)) {
              newmarks[key] = value;
            } else {
              delete store[deletion.deletedItem];
            }
          }
          location.setItem("markers", JSON.stringify(newmarks));
          location.setItem("location", JSON.stringify(store));
          break;
        default:
          store = JSON.parse(localStorage.getItem(del.tableName)) || {};
          delete store[del.deletedItem];
          deleteTable[del.tableName](del.deletedItem);
          localStorage.setItem(del.tableName, JSON.stringify(store));
          break;
      }
    });
  };

  // src/editHandler.js
  var listEdit = (element) => {
    const newEntry = addBox.cloneNode(true);
    newEntry.style.display = "flex";
    let newInput = document.createElement("textarea");
    let spanElement = element.querySelector("[data-field]");
    newInput.value = spanElement.textContent;
    newInput.dataset.original = spanElement.textContent;
    newInput.id = element.id;
    newInput.dataset.field = "listText";
    spanElement.replaceWith(newInput);
    element.append(newEntry);
    const lId = newInput.id.split("/%/");
    const name = lId[0];
    const order = lId[1];
    element.querySelector('button[name="Change"]').addEventListener("click", (e) => {
      socket.emit("update", {
        table: "lists",
        name,
        order,
        text: newInput.value
      });
      newEntry.remove();
    });
    element.querySelector('button[name="Delete"]').addEventListener("click", (e) => {
      if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original)) {
        revertEditing(newInput);
        newEntry.remove();
        return;
      }
      socket.emit("delete", {
        table: "lists",
        name,
        order: parseInt(order)
      });
      newEntry.remove();
    });
  };
  var characterEditables = [
    ".characterHome",
    ".characterName",
    ".characterPronouns",
    ".characterOccupation",
    ".characterInfo",
    ".characterTraits"
  ];
  var characterEdit = (element) => {
    if (!element.dataset.characterId) return;
    const newEntry = addBox.cloneNode(true);
    newEntry.style.display = "flex";
    const thing = element.children;
    for (const detail of characterEditables) {
      const exist = element.querySelector(detail);
      const newInput = document.createElement("textarea");
      const spanElement = exist.querySelector("span");
      newInput.dataset.original = spanElement.textContent;
      newInput.value = spanElement.textContent;
      spanElement.replaceWith(newInput);
    }
    element.append(newEntry);
    element.querySelector('button[name="Change"]').addEventListener("click", (e) => {
      socket.emit("update", {
        table: "characters",
        id: element.dataset.characterId,
        home: element.querySelector(`.characterHome textarea`).value,
        name: element.querySelector(`.characterName textarea`).value,
        pronouns: element.querySelector(`.characterPronouns textarea`).value,
        occupation: element.querySelector(`.characterOccupation textarea`).value,
        info: element.querySelector(`.characterInfo textarea`).value,
        traits: element.querySelector(`.characterTraits textarea`).value
      });
      newEntry.remove();
      clear(element);
    });
    element.querySelector('button[name="Delete"]').addEventListener("click", (e) => {
      if (!window.confirm("Delete Character? \n Character:")) {
        revertEditing(element);
        newEntry.remove();
        return;
      }
      socket.emit("delete", {
        table: "characters",
        id: element.dataset.characterId
      });
      newEntry.remove();
      clear(element);
    });
  };
  var clear = (element) => {
    delete element.dataset.characterId;
    for (const detail of characterEditables) {
      const exist = element.querySelector(detail);
      const damned = exist.lastElementChild;
      const spanElement = document.createElement("span");
      damned.replaceWith(spanElement);
    }
  };
  var listRevert = (element) => {
    let spanElement = document.createElement("span");
    spanElement.textContent = element.dataset.original;
    spanElement.dataset.field = "listText";
    element.replaceWith(spanElement);
  };
  var characterRevert = (element) => {
    for (const detail of characterEditables) {
      const exist = element.querySelector(detail);
      const inputElement = exist.querySelector("textarea");
      const spanElement = document.createElement("span");
      spanElement.textContent = inputElement.dataset.original;
      inputElement.replaceWith(spanElement);
    }
  };
  var formatAddTable = {
    "lists": (element) => {
      const last = element.lastElementChild;
      const num = last ? parseInt(last.dataset.index) + 1 : 1;
      return {
        table: "lists",
        name: element.id,
        order: parseInt(num),
        text: "Etc...."
      };
    },
    "characters": (element) => {
      return {
        table: "characters",
        id: crypto.randomUUID(),
        home: `At World's End`,
        name: "Add here...",
        pronouns: "(They/them)",
        occupation: "New Occupation",
        info: "New fellow...",
        traits: "Friendly"
      };
    },
    "locations": (element) => {
      const last = element.lastElementChild;
      let sig = null;
      if (last) {
        sig = last.querySelector(".signifier").textContent;
        sig = String.fromCharCode(sig.charCodeAt(0) + 1);
      } else {
        sig = "A";
      }
      return {
        table: "locations",
        home: element.id,
        signifier: sig,
        name: "",
        text: ""
      };
    }
  };
  var edit = {
    "lists": listEdit,
    "characters": characterEdit
  };
  var revert = {
    "listText": listRevert,
    "characters": characterRevert
  };
  var startEditing = (element, table) => {
    edit[table](element);
  };
  var revertEditing = (element) => {
    revert[element.dataset.field](element);
  };

  // src/start.js
  var sidebarEvents = ["radio", "select-one", "number", "checkbox"];
  var tablists2 = new LinkedList();
  var isUpdatingFromServer = 0;
  var indicatorDragMap = /* @__PURE__ */ new Map();
  var guideBookToggle = false;
  function motherEventFactory(parent, mEvent, selector, handler) {
    parent.addEventListener(mEvent, (e) => {
      const element = e.target.closest(selector);
      if (!element) return;
      handler(element, e);
    });
  }
  motherEventFactory(map, "mousedown", ".draggable", (draggable, e) => {
    let dragHandler = (e2) => drags(map, e2);
    draggable.addEventListener("mousemove", dragHandler);
    indicatorDragMap.set(draggable, dragHandler);
  });
  motherEventFactory(map, "mouseup", ".draggable", (draggable, event) => {
    for (const [key, value] of indicatorDragMap) {
      key.removeEventListener("mousemove", value);
      indicatorDragMap.delete(key);
    }
  });
  motherEventFactory(document, "mousedown", ".tabs", (draggable, event) => {
    tablists2.popNode(draggable.__nodeRef);
    tablists2.append(draggable);
    caltab();
    draggable.addEventListener("mousemove", tabDrag);
  });
  motherEventFactory(document, "mouseup", ".tabs", (draggable, event) => {
    draggable.removeEventListener("mousemove", tabDrag);
  });
  motherEventFactory(characters, "click", "tr", (row, event) => {
    if (characterInfo.querySelector("button")) return;
    characterInfo.dataset.characterId = row.dataset.id;
    const thing = row.children;
    for (let i = 0; i < thing.length; i++) {
      const exist = thing.item(i);
      const lister = characterInfo.querySelector(`.${exist.dataset.head}`);
      if (lister) {
        lister.innerHTML = "";
        const spanElement = document.createElement("span");
        spanElement.textContent = exist.textContent;
        lister.append(spanElement);
      }
    }
  });
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
  function tabDrag(event) {
    let newleft = event.clientX;
    let newtop = event.clientY;
    if (newleft < event.currentTarget.offsetWidth / 2) newleft = event.currentTarget.offsetWidth / 2;
    if (newtop < event.currentTarget.offsetHeight / 2) newtop = event.currentTarget.offsetHeight / 2;
    if (newleft > window.innerWidth - event.currentTarget.offsetWidth / 2) newleft = window.innerWidth - event.currentTarget.offsetWidth / 2;
    if (newtop > window.innerHeight - event.currentTarget.offsetHeight / 2) newtop = window.innerHeight - event.currentTarget.offsetHeight / 2;
    event.currentTarget.style.left = `${newleft}px`;
    event.currentTarget.style.top = `${newtop}px`;
  }
  guidebook.addEventListener("click", (e) => {
    if (guideBookToggle) {
      e.target.style.backgroundPosition = "100px 50px";
      menu.style.width = "0%";
      menu.style.overflow = "hidden";
      guideBookToggle = false;
    } else {
      e.target.style.backgroundPosition = "50px 50px";
      menu.style.width = "100%";
      menu.style.overflow = "visible";
      guideBookToggle = true;
    }
  });
  var statChange = (event) => {
    if (isUpdatingFromServer > 0) return;
    const eType = event.target.type;
    if (sidebarEvents.includes(eType)) {
      socket.emit("update", {
        table: "stats",
        name: event.target.name,
        type: event.target.type,
        value: eType == "checkbox" ? event.target.checked.toString() : event.target.value
      });
    }
  };
  sidebar.addEventListener("change", statChange);
  assets.addEventListener("change", statChange);
  motherEventFactory(menu, "click", ".openTab", (input, event) => {
    const tab = document.getElementById(input.dataset.toggle);
    if (!tab) return;
    displayToggle(tab);
  });
  var entryAdd = (input, event) => {
    const contain = input.closest(".Contain");
    console.log(contain);
    const addItem = contain.querySelector(`#${contain.dataset.contain}`);
    const result = formatAddTable[addItem.dataset.tabletype](addItem);
    socket.emit("create", result);
  };
  motherEventFactory(sidebar, "click", ".tabIcon", entryAdd);
  motherEventFactory(assets, "click", ".tabIcon", entryAdd);
  motherEventFactory(characters, "click", ".tabIcon", entryAdd);
  function displayToggle(element) {
    if (!element) return;
    if (element.style.display == "") {
      element.style.display = "flex";
      tablists2.append(element);
      caltab();
    } else {
      element.style.display = "";
      tablists2.popNode(element.__nodeRef.element);
    }
  }
  function caltab() {
    let temp = tablists2.head;
    let count = 10;
    while (temp != null) {
      temp.element.style.zIndex = count;
      count += 1;
      temp = temp.next;
    }
  }
  motherEventFactory(document, "dblclick", "[data-editable]", (editable, event) => {
    if (editable.querySelector("button")) return;
    startEditing(editable, editable.dataset.editable);
  });
  socket.on("connect", () => {
    let check = localStorage.getItem("time") || 0;
    socket.emit("checkSync", check);
  });
  socket.on("create", (create) => {
    isUpdatingFromServer++;
    loadOperator(create);
    isUpdatingFromServer--;
  });
  socket.on("update", (update) => {
    isUpdatingFromServer++;
    updateOperator(update);
    isUpdatingFromServer--;
  });
  socket.on("delete", (deleted) => {
    isUpdatingFromServer++;
    deleteOperation([deleted]);
    isUpdatingFromServer--;
  });
  socket.on("checkSync", (check) => {
    storeNewRows(check);
  });
  loadTables();
})();
//# sourceMappingURL=bundle.js.map
