(() => {
  // src/dataHandler/homesHandler.js
  var homesOperator = (key, value) => {
    const thing = document.getElementById("locationList");
    console.log(thing);
    return thing;
  };
  var homesUpdateOperator = (key, value) => {
    console.log("Update", key);
    return document.getElementById("locationList");
  };
  var homesDeleteOperator = (key, value) => {
    console.log("Delete", key);
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
    console.log(listElement);
    listElement.remove();
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

  // src/syncHandler.js
  var loadTable = {
    "homes": homesOperator,
    "stats": statsOperator,
    "lists": listsOperator
    //    'characters': charactersSync, 
    //   'locations': locationsSync,
    //    'markers': markersSync 
  };
  var updateTable = {
    "homes": homesUpdateOperator,
    "stats": statsOperator,
    "lists": listsUpdateOperator
    //'characters': 
    //'locations': 
    //'markers': 
  };
  var deleteTable = {
    "homes": homesDeleteOperator,
    //'stats': statsOperator,
    "lists": listsDeleteOperator
    // 'characters'
    // 'locations'
    // 'markers'
  };
  var loadOperator = (create) => {
    console.log(create);
    const [key, value] = Object.entries(create)[0];
    localStorage.setItem("time", value.latestModified);
    const sum = convertRow(convertTable[key], value);
    const log = JSON.parse(localStorage.getItem(key));
    const element = loadTable[key](sum.index, sum.row);
    log[sum.index] = sum.row;
    localStorage.setItem(key, log);
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
    localStorage.setItem(key, log);
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
      console.log(check);
      if (key == "deleteRecords") {
        deleteOperation(value);
      } else if (key == "time") {
        localStorage.setItem(key, value);
      } else {
        var current = JSON.parse(localStorage.getItem(key)) || {};
        value.forEach((row) => {
          const add = convertRow(convertTable[key], row);
          console.log(add);
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
  var listEdit = (socket2, element) => {
    let newInput = document.createElement("input");
    let spanElement = element.querySelector("[data-field]");
    newInput.type = "text";
    newInput.value = spanElement.textContent;
    newInput.id = element.id;
    let id = element.id.split("/%/");
    let name = id[0];
    console.log("Name:" + name);
    let torder = id[1];
    console.log("order:" + torder);
    newInput.dataset.field = "listText";
    spanElement.replaceWith(newInput);
    newInput.addEventListener("change", (e) => {
      socket2.emit(e.target.value == "" ? "delete" : "update", {
        table: "lists",
        name,
        order: torder,
        text: e.target.value
      });
    });
  };
  var edit = {
    "lists": listEdit
  };
  var startEditing = (socket2, element, table) => {
    edit[table](socket2, element);
  };

  // src/start.js
  var socket = io();
  var templates = document.getElementById("templates");
  var sidebar = document.getElementById("sidebar");
  var guide = document.getElementById("guide");
  var isUpdatingFromServer = 0;
  var space = document.querySelector("#town");
  var draggables = document.querySelectorAll(".indicators");
  function drags(event) {
    let boundaries = space.getBoundingClientRect();
    let newleft = (event.clientX - event.currentTarget.offsetWidth / 2 - boundaries.left) / space.offsetWidth * 100;
    let newtop = (event.clientY - event.currentTarget.offsetHeight / 2 - boundaries.top) / space.offsetHeight * 100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop > 95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
  }
  draggables.forEach((element) => {
    element.addEventListener("mousedown", () => {
      element.addEventListener("mousemove", drags);
    });
    element.addEventListener("mouseup", () => {
      element.removeEventListener("mousemove", drags);
      socket.emit("markerChange", {
        id: element.id,
        left: element.style.left,
        top: element.style.top
      });
    });
  });
  var guidebook = document.querySelector("#guide");
  var menu = document.querySelector("#menu");
  var menuToggle = false;
  guidebook.addEventListener("click", (e) => {
    if (menuToggle) {
      e.target.style.backgroundPosition = "100px 50px";
      menu.style.width = "0%";
      menu.style.overflow = "hidden";
      menuToggle = false;
    } else {
      e.target.style.backgroundPosition = "50px 50px";
      menu.style.width = "100%";
      menu.style.overflow = "visible";
      menuToggle = true;
    }
  });
  var sidebarEvents = ["radio", "select-one", "number"];
  sidebar.addEventListener("change", (event) => {
    if (isUpdatingFromServer > 0) return;
    const eType = event.target.type;
    if (sidebarEvents.includes(eType)) {
      socket.emit("update", {
        table: "stats",
        name: event.target.name,
        type: event.target.type,
        value: event.target.value
      });
    } else if (eType == "checkbox") {
      console.log(event.target.checked.toString());
      socket.emit("update", {
        table: "stats",
        name: event.target.name,
        type: event.target.type,
        value: event.target.checked.toString()
      });
    }
  });
  document.addEventListener("dblclick", (e) => {
    const editable = e.target.closest("[data-editable]");
    if (!editable) return;
    startEditing(socket, editable, editable.dataset.editable);
  });
  loadTables();
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
    console.log(deleted);
    deleteOperation([deleted]);
    isUpdatingFromServer--;
  });
  socket.on("checkSync", (check) => {
    storeNewRows(check);
  });
})();
//# sourceMappingURL=bundle.js.map
