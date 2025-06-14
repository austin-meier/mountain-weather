const getWeatherDiv = async () => {
  const resp = await fetch("http://localhost:3000/forecast", {
    headers: { Accept: "application/json" },
  });

  const data = await resp.json();

  const getFirstTable = (obj) => {
    if (obj.table) return obj.table;

    for (const val of Object.values(obj)) {
      if (typeof val === "object") return getFirstTable(val);
    }
  };

  const raw = getFirstTable(data);
  let div = raw.replaceAll(
    /\/packs\/components\/(.+?)\/static\/(\w+).*?.svg/g,
    "/$1/$2.svg"
  );
  div = div.replaceAll(/(<i class="icon-temp">.*?<\/i>)/g, "");
  div = div.replace(/<i class="icon-snow"><\/i>/, "<i>snow</i>");
  div = div.replace(/<i class="icon-rain"><\/i>/, "<i>rain</i>");
  return div;
};

const cToF = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

const kphToMph = (kph) => kph * 0.621371;

const metersToFeet = (meters) => meters * 3.28084;

const changeTemp = () => {
  [...document.querySelectorAll("div .temp-value")].forEach((ele) => {
    if (ele.tagName === "DIV") {
      const temp = Number(ele.textContent);
      ele.textContent = cToF(temp).toFixed(1);
    } else {
      // It's a SVG group tag
      let t = ele.querySelector("text");
      const temp = Number(t.textContent);
      t.innerHTML = Math.round(cToF(temp));
    }
  });
  [...document.querySelectorAll(".tempu")].forEach((ele) => {
    ele.textContent = "F";
  });
};

const changeWind = () => {
  [...document.querySelectorAll(".wind-icon__val")].forEach((ele) => {
    const kph = Number(ele.textContent);
    const mph = Math.round(kphToMph(kph));
    ele.textContent = mph;
  });
  [...document.querySelectorAll(".windu")].forEach((ele) => {
    ele.textContent = "wind mph";
  });
};

const changeAltitude = () => {
  [...document.querySelectorAll(".level-value")].forEach((ele) => {
    const meters = Number(ele.textContent);
    const ft = Math.round(metersToFeet(meters));
    ele.textContent = ft;
  });

  [...document.querySelectorAll(".flscale-unit")].forEach((ele) => {
    const meters = Number(ele.textContent.slice(0, -1));
    const ft = Math.round(metersToFeet(meters));
    ele.textContent = ft + "ft";
  });

  [...document.querySelectorAll(".heightu")].forEach((ele) => {
    ele.textContent = "ft";
  });
};

getWeatherDiv().then((data) => {
  document.querySelector("#forecast").insertAdjacentHTML("afterbegin", data);
  changeTemp();
  changeWind();
  changeAltitude();
});
