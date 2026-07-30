const indicateTimers = new Map();
const updateIndicate = (el)=>  {
    const prior = indicateTimers.get(el);
    if (prior) clearTimeout(prior);
    el.style.transition = "box-shadow 0.15s ease, outline-color 0.15s ease" ;
    el.style.boxShadow = "0px 0px 3px 2px lightblue";
    el.style.outlineColor = "lightblue";
      const t = setTimeout(() => {
        el.style.boxShadow = "none";
        el.style.outlineColor="#333";
        indicateTimers.delete(el);
      }, 500);
    indicateTimers.set(el,t);
};

export {updateIndicate};
