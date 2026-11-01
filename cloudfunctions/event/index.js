var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// outputs/random-app/cloudfunctions/event/handler.ts
var handler_exports = {};
__export(handler_exports, {
  main: () => main
});
module.exports = __toCommonJS(handler_exports);
var import_wx_server_sdk = __toESM(require("wx-server-sdk"));
var import_node_crypto = require("node:crypto");

// outputs/random-app/packages/lottery-core/index.ts
var clone = (value) => JSON.parse(JSON.stringify(value));
function check(ok, message) {
  if (!ok)
    throw new Error(message);
}
function createEvent(input) {
  const rules = clone(input);
  check(rules.name.trim(), "\u8BF7\u586B\u5199\u6D3B\u52A8\u540D\u79F0");
  check(rules.participants.length > 0 && rules.participants.length <= 1e3, "\u540D\u5355\u9700\u4E3A1\u20131000\u4EBA");
  check(new Set(rules.participants.map((p) => p.id)).size === rules.participants.length, "\u53C2\u4E0E\u4EBAID\u91CD\u590D");
  check(rules.participants.every((p) => p.id && p.name.trim()), "\u53C2\u4E0E\u4EBA\u4E0D\u80FD\u4E3A\u7A7A");
  check(rules.prizes.length > 0 && new Set(rules.prizes.map((p) => p.id)).size === rules.prizes.length, "\u5956\u9879\u4E0D\u80FD\u4E3A\u7A7A\u6216\u91CD\u590D");
  let total = 0;
  for (const p of rules.prizes) {
    check(p.id && p.name.trim() && p.batches.length > 0, "\u8BF7\u5B8C\u5584\u5956\u9879");
    for (const n of p.batches) {
      check(Number.isSafeInteger(n) && n > 0, "\u6279\u6B21\u6570\u91CF\u5FC5\u987B\u662F\u6B63\u6574\u6570");
      total += n;
    }
    for (const [id, w] of Object.entries(p.weights || {}))
      check(rules.participants.some((x) => x.id === id) && Number.isFinite(w) && w > 0 && w <= 1e6, "\u6743\u91CD\u5FC5\u987B\u4E3A\u6B63\u6570\u4E14\u4E0D\u8D85\u8FC71000000");
  }
  check(total <= rules.participants.length, "\u603B\u540D\u989D\u8D85\u8FC7\u53C2\u4E0E\u4EBA\u6570");
  return { rules, phase: "ready", prize: 0, batch: 0, results: [], version: 0 };
}
function startDraw(state) {
  check(state.phase === "ready", "\u5F53\u524D\u4E0D\u80FD\u5F00\u59CB");
  return { ...clone(state), phase: "running", version: state.version + 1 };
}
function stopDraw(state, random, now = Date.now()) {
  check(state.phase === "running", "\u5F53\u524D\u4E0D\u80FD\u505C\u6B62");
  const s = clone(state), p = s.rules.prizes[s.prize];
  const used = new Set(s.results.flatMap((r) => r.winners.map((w) => w.id)));
  let pool = s.rules.participants.filter((x) => !used.has(x.id));
  const winners = [];
  for (let n = 0; n < p.batches[s.batch]; n++) {
    const total = pool.reduce((a, x) => a + (p.weights?.[x.id] ?? 1), 0);
    const r = random();
    check(Number.isFinite(r) && r >= 0 && r < 1, "\u968F\u673A\u6E90\u5F02\u5E38");
    let value = r * total;
    let i = pool.length - 1;
    for (let j = 0; j < pool.length; j++) {
      value -= p.weights?.[pool[j].id] ?? 1;
      if (value < 0) {
        i = j;
        break;
      }
    }
    winners.push(pool.splice(i, 1)[0]);
  }
  s.results.push({ prizeId: p.id, batch: s.batch, winners, at: now });
  s.phase = "revealed";
  s.version++;
  return s;
}
function nextDraw(state) {
  check(state.phase === "revealed", "\u8BF7\u5148\u5B8C\u6210\u5F53\u524D\u6279\u6B21");
  const s = clone(state);
  if (s.batch + 1 < s.rules.prizes[s.prize].batches.length)
    s.batch++;
  else {
    s.prize++;
    s.batch = 0;
  }
  s.phase = s.prize === s.rules.prizes.length ? "complete" : "ready";
  s.version++;
  return s;
}

// outputs/random-app/cloudfunctions/event/service.ts
var clone2 = (value) => JSON.parse(JSON.stringify(value));
function eventService(repo, random) {
  return {
    async create(owner, rules) {
      if (!owner)
        throw new Error("UNAUTHENTICATED");
      return repo.insert({ owner, state: createEvent(rules), requests: {} });
    },
    async command(owner, id, action, version, requestId) {
      if (!owner)
        throw new Error("UNAUTHENTICATED");
      if (!/^[a-zA-Z0-9-]{8,80}$/.test(requestId))
        throw new Error("INVALID_REQUEST_ID");
      return repo.transaction(id, (record) => {
        if (record.owner !== owner)
          throw new Error("FORBIDDEN");
        const cached = Object.hasOwn(record.requests, requestId) ? record.requests[requestId] : void 0;
        if (cached) {
          if (cached.action !== action || cached.version !== version)
            throw new Error("REQUEST_ID_REUSED");
          return clone2(cached.result);
        }
        if (record.state.version !== version)
          throw new Error("VERSION_CONFLICT");
        let result;
        if (action === "start")
          result = startDraw(record.state);
        else if (action === "stop")
          result = stopDraw(record.state, random);
        else if (action === "next")
          result = nextDraw(record.state);
        else
          throw new Error("INVALID_ACTION");
        record.state = result;
        record.requests = {};
        record.requests[requestId] = { action, version, result: clone2(result) };
        return clone2(result);
      });
    }
  };
}

// outputs/random-app/cloudfunctions/event/handler.ts
import_wx_server_sdk.default.init({ env: import_wx_server_sdk.default.DYNAMIC_CURRENT_ENV });
var db = import_wx_server_sdk.default.database();
var collection = "lottery_events";
var collectionReady = false;
function getData(response) {
  return Array.isArray(response.data) ? response.data[0] : response.data;
}
async function read(doc) {
  try {
    return getData(await doc.get());
  } catch (e) {
    if (/document.*(not exist|does not exist)/i.test(String(e.message)))
      return null;
    throw e;
  }
}
function requireOwner(record, owner) {
  if (!record)
    throw new Error("NOT_FOUND");
  if (record.owner !== owner)
    throw new Error("FORBIDDEN");
}
async function main(input) {
  try {
    const owner = import_wx_server_sdk.default.getWXContext().OPENID;
    if (!owner)
      throw new Error("UNAUTHENTICATED");
    if (!input || !["create", "get", "start", "stop", "next"].includes(input.action))
      throw new Error("INVALID_ACTION");
    if (JSON.stringify(input).length > 64e3)
      throw new Error("\u6D3B\u52A8\u914D\u7F6E\u8FC7\u5927\uFF0C\u8BF7\u51CF\u5C11\u540D\u5355\u6216\u5956\u9879");
    const id = input.action === "create" ? (0, import_node_crypto.createHash)("sha256").update(owner + ":" + String(input.requestId)).digest("hex") : input.id;
    if (typeof id !== "string" || !/^[a-f0-9]{64}$/.test(id))
      throw new Error("INVALID_EVENT_ID");
    const doc = db.collection(collection).doc(id);
    if (input.action === "create" && !collectionReady) {
      try {
        await db.createCollection(collection);
      } catch (e) {
        if (!/already exists|已存在|ResourceExist|COLLECTION_EXIST/i.test(e.message))
          throw e;
      }
      collectionReady = true;
    }
    const repo = {
      async insert(record2) {
        if (!/^[a-zA-Z0-9-]{8,80}$/.test(input.requestId || ""))
          throw new Error("INVALID_REQUEST_ID");
        const fingerprint = (0, import_node_crypto.createHash)("sha256").update(JSON.stringify(record2.state.rules)).digest("hex");
        await db.runTransaction(async (tx) => {
          const ref = tx.collection(collection).doc(id);
          const old = await read(ref);
          if (old) {
            requireOwner(old, owner);
            if (old.fingerprint !== fingerprint)
              throw new Error("REQUEST_ID_REUSED");
            return;
          }
          await ref.set({ data: { ...record2, fingerprint, createdAt: Date.now() } });
        });
        return id;
      },
      async transaction(eventId, fn) {
        return db.runTransaction(async (tx) => {
          const ref = tx.collection(collection).doc(eventId);
          const record2 = await read(ref);
          requireOwner(record2, owner);
          const value = fn(record2);
          const { _id, ...data } = record2;
          await ref.set({ data: { ...data, updatedAt: Date.now() } });
          return value;
        });
      }
    };
    const service = eventService(repo, () => (0, import_node_crypto.randomBytes)(6).readUIntBE(0, 6) / 281474976710656);
    if (input.action === "create")
      await service.create(owner, input.rules);
    else if (input.action !== "get") {
      if (!Number.isSafeInteger(input.version) || input.version < 0)
        throw new Error("INVALID_VERSION");
      const state = await service.command(owner, id, input.action, input.version, input.requestId);
      return { ok: true, id, state };
    }
    const record = await read(doc);
    requireOwner(record, owner);
    return { ok: true, id, state: record.state };
  } catch (e) {
    console.error("event operation failed", e);
    return { ok: false, error: e.message || "CLOUD_ERROR" };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
