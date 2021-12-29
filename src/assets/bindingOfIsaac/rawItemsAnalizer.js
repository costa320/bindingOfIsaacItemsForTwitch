var fs = require("fs");
var path = require("path");
const cheerio = require("cheerio");
var jsdom = require("jsdom");
const rawUrl = path.resolve(__dirname, "all_Items_raw.html");
const outputItemsFile = path.resolve(__dirname);

var $ = require("jquery")(new jsdom.JSDOM().window);
var helpers = require("../helpers/helpers.js");

let initialObj = {
  repentance: {
    label: "Repentance",
    items: [],
    trinkets: [],
  },
  afterbirthPlus: {
    label: "Afterbirth Plus",
    items: [],
    trinkets: [],
  },
  afterbirth: {
    label: "Afterbirth",
    items: [],
    trinkets: [],
  },
  rebirth: {
    label: "Rebirth",
    items: [],
    trinkets: [],
  },
  tarot: {
    label: "Repentance tarot's",
    items: [],
    trinkets: [],
  },
};

class Item {
  constructor(
    title = "",
    itemid = "",
    pickup = "",
    quality = "",
    description = [],
    tags = [],
    sid = ""
  ) {
    this.title = title;
    this.itemid = itemid;
    this.pickup = pickup;
    this.quality = quality;
    this.description = description;
    this.tags = tags;
    this.sid = sid;
  }
}

function ParseWholeFile(_rawHtml) {
  rawHtml.each(function (i, container) {
    /* each Category of items/trinkets */
    let { id, children } = container;
    if (id) {
      var _children = Array.from(children);

      /* es. rebirth-items */
      let [version, type] = id.split("-");
      console.log("Starting to cycle thru => ", version, type);

      _children.forEach(function (li, i) {
        /* each Item/trinket */
        initialObj[version][type].push(ParseRawItem(li, i));
      });
      /* logging */
      console.log("checkPoint => ", [version][type], initialObj[version][type]);
    }
  });

  return initialObj;
}

function ParseRawItem(li, li_i) {
  let title;
  let itemid;
  let pickup;
  let quality;
  let description = [];
  let tags = [];
  let sid = $(li).data("sid");
  let pList = Array.from($("p", li));

  pList.forEach((nodeParagraph, i) => {
    let { className, children, firstChild, innerHTML } = nodeParagraph;
    /* var _children = Array.from(children); */
    let stringsInP = [];
    /* console.log(nodeParagraph); */

    if (!innerHTML) {
      console.log("LI : ", li_i);
      console.log("nodeParagraph: ", i);
      console.log("pList:", pList);
    }

    switch (className) {
      case "item-title":
        title = innerHTML;
        break;
      case "r-itemid":
        itemid = innerHTML;
        break;
      case "pickup":
        pickup = innerHTML;
        break;
      case "quality":
        quality = innerHTML;
        break;
      case "tags":
        tags.push(innerHTML);
        break;
      default:
        description.push(innerHTML);
        break;
    }
  });

  return new Item(title, itemid, pickup, quality, description, tags, sid);
}

let rawHtml = $(fs.readFileSync(rawUrl, "utf8"));
helpers.WriteToFile(
  outputItemsFile + "/allItems.json",
  ParseWholeFile(rawHtml)
);
