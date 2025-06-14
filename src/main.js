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

const changeTemp = () => {
  [...document.querySelectorAll(".temp-value")].forEach((ele) => {
    const temp = Number(ele.textContent);
    ele.textContent = cToF(temp).toFixed(1);
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

getWeatherDiv().then((data) => {
  document.querySelector("#forecast").insertAdjacentHTML("afterbegin", data);
  changeTemp();
  changeWind();
});
