// src/index.ts
import { logger as logger31 } from "@elizaos/core";

// src/actions/addToPlaylist.ts
import {
  logger as logger2
} from "@elizaos/core";

// src/components/playlists.ts
import { logger } from "@elizaos/core";

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, v >>> 16 & 255, v >>> 8 & 255, v & 255, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255, v / 4294967296 & 255, v >>> 24 & 255, v >>> 16 & 255, v >>> 8 & 255, v & 255);
}
var parse_default = parse;

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/rng.js
import { randomFillSync } from "node:crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(version, hash, value, namespace, buf, offset) {
  const valueBytes = typeof value === "string" ? stringToBytes(value) : value;
  const namespaceBytes = typeof namespace === "string" ? parse_default(namespace) : namespace;
  if (typeof namespace === "string") {
    namespace = parse_default(namespace);
  }
  if (namespace?.length !== 16) {
    throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
  }
  let bytes = new Uint8Array(16 + valueBytes.length);
  bytes.set(namespaceBytes);
  bytes.set(valueBytes, namespaceBytes.length);
  bytes = hash(bytes);
  bytes[6] = bytes[6] & 15 | version;
  bytes[8] = bytes[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = bytes[i];
    }
    return buf;
  }
  return unsafeStringify(bytes);
}

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/native.js
import { randomUUID } from "node:crypto";
var native_default = { randomUUID };

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/v4.js
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  return _v4(options, buf, offset);
}
var v4_default = v4;

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/sha1.js
import { createHash } from "node:crypto";
function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === "string") {
    bytes = Buffer.from(bytes, "utf8");
  }
  return createHash("sha1").update(bytes).digest();
}
var sha1_default = sha1;

// ../../node_modules/.bun/uuid@13.0.0/node_modules/uuid/dist-node/v5.js
function v5(value, namespace, buf, offset) {
  return v35(80, sha1_default, value, namespace, buf, offset);
}
v5.DNS = DNS;
v5.URL = URL;
var v5_default = v5;

// src/components/componentData.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function serializeMetadataValue(value) {
  if (value === void 0) {
    return void 0;
  }
  const serialized = JSON.stringify(value);
  if (serialized === void 0) {
    return void 0;
  }
  return JSON.parse(serialized);
}
function getStoredField(component, field) {
  if (!component?.data) {
    return null;
  }
  if (!isRecord(component.data)) {
    throw new Error(
      `[Music Library] Component ${component.type} has invalid data payload`
    );
  }
  const value = component.data[field];
  if (value === void 0 || value === null) {
    return null;
  }
  return value;
}
function createStoredField(field, value) {
  return {
    [field]: serializeMetadataValue(value)
  };
}
function mergeStoredField(component, field, value) {
  return {
    ...component.data ?? {},
    [field]: serializeMetadataValue(value)
  };
}

// src/components/storageContext.ts
import {
  createUniqueUuid
} from "@elizaos/core";
async function requireRoomContext(runtime, roomId, featureName) {
  const room = await runtime.getRoom(roomId);
  if (!room) {
    throw new Error(`[${featureName}] Room ${roomId} not found`);
  }
  if (!room.worldId) {
    throw new Error(`[${featureName}] Room ${roomId} is missing worldId`);
  }
  return {
    room,
    roomId,
    worldId: room.worldId
  };
}
async function ensureAgentStorageContext(runtime, purpose, source) {
  const worldId = createUniqueUuid(runtime, `${purpose}-world`);
  const roomId = createUniqueUuid(runtime, `${purpose}-room`);
  await runtime.ensureWorldExists({
    id: worldId,
    name: `${purpose} World`,
    agentId: runtime.agentId,
    metadata: { purpose }
  });
  await runtime.ensureRoomExists({
    id: roomId,
    name: `${purpose} Room`,
    source,
    type: "GROUP",
    channelId: roomId,
    serverId: roomId,
    worldId,
    metadata: { purpose }
  });
  return { roomId, worldId };
}

// src/components/playlists.ts
var PLAYLIST_COMPONENT_TYPE = "dj_playlist";
async function savePlaylist(runtime, entityId, playlist) {
  const playlistId = playlist.id || v4_default();
  const now = Date.now();
  const fullPlaylist = {
    ...playlist,
    id: playlistId,
    createdAt: playlist.createdAt || now,
    updatedAt: now
  };
  const existingComponent = await runtime.getComponent(
    entityId,
    PLAYLIST_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  const playlists = getStoredField(existingComponent, "playlists") ?? [];
  const index = playlists.findIndex((p) => p.id === playlistId);
  if (index >= 0) {
    playlists[index] = fullPlaylist;
  } else {
    playlists.push(fullPlaylist);
  }
  if (existingComponent) {
    await runtime.updateComponent({
      ...existingComponent,
      data: mergeStoredField(existingComponent, "playlists", playlists)
    });
  } else {
    const entity = await runtime.getEntityById(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }
    const storageContext = await ensureAgentStorageContext(
      runtime,
      "playlists",
      "music-library"
    );
    await runtime.createComponent({
      id: v4_default(),
      entityId,
      agentId: runtime.agentId,
      roomId: storageContext.roomId,
      worldId: storageContext.worldId,
      sourceEntityId: runtime.agentId,
      type: PLAYLIST_COMPONENT_TYPE,
      createdAt: now,
      data: createStoredField("playlists", playlists)
    });
  }
  logger.debug(`Saved playlist "${fullPlaylist.name}" for entity ${entityId}`);
  return fullPlaylist;
}
async function loadPlaylists(runtime, entityId) {
  const component = await runtime.getComponent(
    entityId,
    PLAYLIST_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  return getStoredField(component, "playlists") ?? [];
}
async function deletePlaylist(runtime, entityId, playlistId) {
  const component = await runtime.getComponent(
    entityId,
    PLAYLIST_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    return false;
  }
  const playlists = getStoredField(component, "playlists") ?? [];
  const filtered = playlists.filter((p) => p.id !== playlistId);
  await runtime.updateComponent({
    ...component,
    data: mergeStoredField(component, "playlists", filtered)
  });
  logger.debug(`Deleted playlist ${playlistId} for entity ${entityId}`);
  return true;
}

// src/utils/smartFetchService.ts
function getSmartMusicFetchService(runtime) {
  const service = runtime.getService(
    "smart-music-fetch"
  );
  if (!service) {
    throw new Error("Smart music fetch service is not available");
  }
  return service;
}

// src/actions/addToPlaylist.ts
var addToPlaylist = {
  name: "ADD_TO_PLAYLIST",
  similes: [
    "ADD_SONG_TO_PLAYLIST",
    "PUT_IN_PLAYLIST",
    "SAVE_TO_PLAYLIST",
    "ADD_TRACK_TO_PLAYLIST"
  ],
  description: "Add music to a playlist. If the track is not already in the library, the configured music fetch service must resolve it first. Creates the playlist if it does not exist.",
  validate: async (_runtime, _message, _state) => {
    return true;
  },
  handler: async (runtime, message, _state, _options, callback) => {
    const messageText = message.content.text || "";
    const addToPattern = /add\s+(.+?)\s+to\s+(?:playlist\s+)?(.+)/i;
    const match = messageText.match(addToPattern);
    if (!match) {
      await callback({
        text: 'Please specify what song to add and which playlist. Example: "add Bohemian Rhapsody to my favorites"',
        source: message.content.source
      });
      return;
    }
    const songQuery = match[1].trim();
    const playlistName = match[2].trim();
    if (!songQuery || songQuery.length < 3) {
      await callback({
        text: "Please specify a song name (at least 3 characters).",
        source: message.content.source
      });
      return;
    }
    if (!playlistName || playlistName.length < 2) {
      await callback({
        text: "Please specify a playlist name (at least 2 characters).",
        source: message.content.source
      });
      return;
    }
    try {
      const smartFetch = getSmartMusicFetchService(runtime);
      const preferredQuality = runtime.getSetting("MUSIC_QUALITY_PREFERENCE") || "mp3_320";
      await callback({
        text: `Searching for "${songQuery}"...`,
        source: message.content.source
      });
      let lastProgress = "";
      const onProgress = async (progress) => {
        const progressLabel = progress.stage || progress.message || "working";
        const statusText = progress.details ? `${progressLabel}: ${String(progress.details)}` : progressLabel;
        if (statusText !== lastProgress) {
          lastProgress = statusText;
          logger2.info(`[ADD_TO_PLAYLIST] ${statusText}`);
        }
      };
      const result = await smartFetch.fetchMusic({
        query: songQuery,
        requestedBy: message.entityId,
        onProgress,
        preferredQuality
      });
      if (!result.success || !result.url) {
        await callback({
          text: `Couldn't find or download "${songQuery}". ${result.error || "Please try a different search term."}`,
          source: message.content.source
        });
        return;
      }
      const existingPlaylists = await loadPlaylists(runtime, message.entityId);
      let targetPlaylist = existingPlaylists.find(
        (playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase()
      );
      if (!targetPlaylist) {
        targetPlaylist = {
          id: crypto.randomUUID(),
          name: playlistName,
          tracks: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }
      const trackExists = targetPlaylist.tracks.some(
        (track) => track.url === result.url
      );
      if (!trackExists) {
        targetPlaylist.tracks.push({
          url: result.url,
          title: result.title || songQuery,
          duration: result.duration,
          addedAt: Date.now()
        });
        targetPlaylist.updatedAt = Date.now();
        await savePlaylist(runtime, message.entityId, targetPlaylist);
        let responseText = `Added **${result.title || songQuery}** to playlist "${playlistName}"`;
        if (result.source === "torrent") {
          responseText += "\nFetched via torrent";
        }
        responseText += `
Playlist now has ${targetPlaylist.tracks.length} track${targetPlaylist.tracks.length !== 1 ? "s" : ""}`;
        await callback({
          text: responseText,
          actions: ["ADD_TO_PLAYLIST_RESPONSE"],
          source: message.content.source
        });
      } else {
        await callback({
          text: `**${result.title || songQuery}** is already in playlist "${playlistName}"`,
          source: message.content.source
        });
      }
      await runtime.createMemory(
        {
          entityId: message.entityId,
          agentId: message.agentId,
          roomId: message.roomId,
          content: {
            source: message.content.source,
            thought: `Added ${result.title || songQuery} to playlist ${playlistName} (source: ${result.source})`,
            actions: ["ADD_TO_PLAYLIST"]
          },
          metadata: {
            type: "custom",
            actionName: "ADD_TO_PLAYLIST",
            audioUrl: result.url,
            title: result.title || songQuery,
            playlistName,
            playlistId: targetPlaylist.id,
            source: result.source
          }
        },
        "messages"
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger2.error("Error in ADD_TO_PLAYLIST action:", errorMessage);
      await callback({
        text: `I encountered an error while trying to add "${songQuery}" to playlist "${playlistName}". ${errorMessage}`,
        source: message.content.source
      });
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Add Stairway to Heaven to my rock classics playlist"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "I'll add that to your rock classics playlist!",
          actions: ["ADD_TO_PLAYLIST"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "add some Pink Floyd to playlist chill vibes"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Finding Pink Floyd and adding to chill vibes!",
          actions: ["ADD_TO_PLAYLIST"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "put Bohemian Rhapsody in my favorites"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Adding Bohemian Rhapsody to your favorites!",
          actions: ["ADD_TO_PLAYLIST"]
        }
      }
    ]
  ]
};
var addToPlaylist_default = addToPlaylist;

// src/actions/deletePlaylist.ts
import {
  ChannelType,
  logger as logger3
} from "@elizaos/core";
var MUSIC_LIBRARY_SERVICE_NAME = "musicLibrary";
var deletePlaylist2 = {
  name: "DELETE_PLAYLIST",
  similes: [
    "REMOVE_PLAYLIST",
    "DELETE_SAVED_PLAYLIST",
    "REMOVE_SAVED_PLAYLIST"
  ],
  description: "Delete a saved playlist. Works best in DMs to avoid flooding group chats.",
  validate: async (_runtime, message, _state) => {
    if (message.content.source !== "discord") {
      return false;
    }
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!callback) {
      return { success: false, error: "Missing callback" };
    }
    const musicLibrary = runtime.getService(
      MUSIC_LIBRARY_SERVICE_NAME
    );
    if (!musicLibrary) {
      await callback({
        text: "Music library service is not available.",
        source: message.content.source
      });
      return { success: false, error: "Music library service unavailable" };
    }
    const userId = message.entityId;
    if (!userId) {
      await callback({
        text: "I could not determine your user ID.",
        source: message.content.source
      });
      return { success: false, error: "Missing user id" };
    }
    try {
      const playlists = await musicLibrary.loadPlaylists(userId);
      if (playlists.length === 0) {
        await callback({
          text: "You don't have any saved playlists to delete.",
          source: message.content.source
        });
        return { success: false, error: "No playlists available" };
      }
      const messageText = message.content.text || "";
      let playlistName;
      const nameMatch = messageText.match(
        /(?:delete|remove).*?playlist.*?(?:named|called)?\s*["']?([^"']+)["']?/i
      );
      if (nameMatch) {
        playlistName = nameMatch[1]?.trim();
      } else {
        const quotedMatch = messageText.match(/["']([^"']+)["']/);
        if (quotedMatch) {
          playlistName = quotedMatch[1]?.trim();
        }
      }
      if (!playlistName) {
        const playlistList = playlists.map((playlist) => `"${playlist.name}"`).join(", ");
        await callback({
          text: `Please specify which playlist to delete. Your playlists: ${playlistList}

Example: "delete playlist My Favorites"`,
          source: message.content.source
        });
        return { success: false, error: "Missing playlist name" };
      }
      const selectedPlaylist = playlists.find(
        (playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase()
      );
      if (!selectedPlaylist) {
        const playlistList = playlists.map((playlist) => `"${playlist.name}"`).join(", ");
        await callback({
          text: `I couldn't find a playlist named "${playlistName}". Your playlists: ${playlistList}`,
          source: message.content.source
        });
        return { success: false, error: "Playlist not found" };
      }
      const deleted = await musicLibrary.deletePlaylist(
        userId,
        selectedPlaylist.id
      );
      if (!deleted) {
        await callback({
          text: "I encountered an error while deleting the playlist.",
          source: message.content.source
        });
        return { success: false, error: "Delete failed" };
      }
      const room = state?.data?.room || await runtime.getRoom(message.roomId);
      const isDM = room?.type === ChannelType.DM;
      let responseText = `Deleted playlist "${selectedPlaylist.name}".`;
      if (!isDM) {
        responseText += " Tip: You can manage playlists in DMs to keep group chats clean.";
      }
      await callback({
        text: responseText,
        source: message.content.source
      });
      return { success: true, text: responseText };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger3.error("Error deleting playlist:", errorMessage);
      await callback({
        text: `I encountered an error while deleting the playlist. ${errorMessage}`,
        source: message.content.source
      });
      return { success: false, error: errorMessage };
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: 'delete playlist "My Favorites"'
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: 'Deleted playlist "My Favorites".'
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "remove playlist Workout Mix"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: 'Deleted playlist "Workout Mix".'
        }
      }
    ]
  ]
};
var deletePlaylist_default = deletePlaylist2;

// src/actions/downloadMusic.ts
import {
  logger as logger4
} from "@elizaos/core";
var downloadMusic = {
  name: "DOWNLOAD_MUSIC",
  similes: [
    "FETCH_MUSIC",
    "GET_MUSIC",
    "DOWNLOAD_SONG",
    "SAVE_MUSIC",
    "GRAB_MUSIC"
  ],
  description: "Download music to the local library without playing it. Requires the configured music fetch service to resolve the track.",
  validate: async (_runtime, _message, _state) => {
    return true;
  },
  handler: async (runtime, message, _state, _options, callback) => {
    const messageText = message.content.text || "";
    const query = messageText.trim();
    if (!query || query.length < 3) {
      await callback({
        text: "Please tell me what song you'd like to download (at least 3 characters).",
        source: message.content.source
      });
      return;
    }
    try {
      const smartFetch = getSmartMusicFetchService(runtime);
      const preferredQuality = runtime.getSetting("MUSIC_QUALITY_PREFERENCE") || "mp3_320";
      await callback({
        text: `Searching for "${query}"...`,
        source: message.content.source
      });
      let lastProgress = "";
      const onProgress = async (progress) => {
        const progressLabel = progress.stage || progress.message || "working";
        const statusText = progress.details ? `${progressLabel}: ${String(progress.details)}` : progressLabel;
        if (statusText !== lastProgress) {
          lastProgress = statusText;
          logger4.info(`[DOWNLOAD_MUSIC] ${statusText}`);
          await callback({
            text: statusText,
            source: message.content.source
          });
        }
      };
      const result = await smartFetch.fetchMusic({
        query,
        requestedBy: message.entityId,
        onProgress,
        preferredQuality
      });
      if (!result.success || !result.url) {
        await callback({
          text: `Couldn't find or download "${query}". ${result.error || "Please try a different search term."}`,
          source: message.content.source
        });
        return;
      }
      let sourceText = "";
      if (result.source === "library") {
        sourceText = "Already in your library";
      } else if (result.source === "ytdlp") {
        sourceText = "Fetched from streaming service";
      } else if (result.source === "torrent") {
        sourceText = "Fetched via torrent";
      }
      const responseText = `**${result.title || query}** - ${sourceText}
Available in your music library`;
      await runtime.createMemory(
        {
          entityId: message.entityId,
          agentId: message.agentId,
          roomId: message.roomId,
          content: {
            source: message.content.source,
            thought: `Downloaded music: ${result.title || query} (source: ${result.source})`,
            actions: ["DOWNLOAD_MUSIC"]
          },
          metadata: {
            type: "custom",
            actionName: "DOWNLOAD_MUSIC",
            audioUrl: result.url,
            title: result.title || query,
            source: result.source
          }
        },
        "messages"
      );
      await callback({
        text: responseText,
        actions: ["DOWNLOAD_MUSIC_RESPONSE"],
        source: message.content.source
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger4.error("Error in DOWNLOAD_MUSIC action:", errorMessage);
      await callback({
        text: `I encountered an error while trying to download "${query}". ${errorMessage}`,
        source: message.content.source
      });
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Download Comfortably Numb by Pink Floyd"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "I'll download that to your library!",
          actions: ["DOWNLOAD_MUSIC"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "fetch some Led Zeppelin for me"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Searching and downloading Led Zeppelin!",
          actions: ["DOWNLOAD_MUSIC"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "grab the entire Dark Side of the Moon album"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "I'll download that album for you!",
          actions: ["DOWNLOAD_MUSIC"]
        }
      }
    ]
  ]
};
var downloadMusic_default = downloadMusic;

// src/actions/listPlaylists.ts
import {
  ChannelType as ChannelType2,
  logger as logger5
} from "@elizaos/core";
var MUSIC_LIBRARY_SERVICE_NAME2 = "musicLibrary";
var listPlaylists = {
  name: "LIST_PLAYLISTS",
  similes: [
    "SHOW_PLAYLISTS",
    "MY_PLAYLISTS",
    "PLAYLIST_LIST",
    "VIEW_PLAYLISTS"
  ],
  description: "List all saved playlists for the user. Works best in DMs to avoid flooding group chats.",
  validate: async (_runtime, message, _state) => {
    if (message.content.source !== "discord") {
      return false;
    }
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!callback) {
      return { success: false, error: "Missing callback" };
    }
    const musicLibrary = runtime.getService(
      MUSIC_LIBRARY_SERVICE_NAME2
    );
    if (!musicLibrary) {
      await callback({
        text: "Music library service is not available.",
        source: message.content.source
      });
      return { success: false, error: "Music library service unavailable" };
    }
    const userId = message.entityId;
    if (!userId) {
      await callback({
        text: "I could not determine your user ID.",
        source: message.content.source
      });
      return { success: false, error: "Missing user id" };
    }
    try {
      const playlists = await musicLibrary.loadPlaylists(userId);
      if (playlists.length === 0) {
        await callback({
          text: "You don't have any saved playlists. Save a queue first using 'save playlist'.",
          source: message.content.source
        });
        return { success: false, error: "No playlists available" };
      }
      const sortedPlaylists = [...playlists].sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
      const room = state?.data?.room || await runtime.getRoom(message.roomId);
      const isDM = room?.type === ChannelType2.DM;
      let text = `**Your Playlists (${sortedPlaylists.length}):**

`;
      for (const playlist of sortedPlaylists) {
        const date = new Date(playlist.updatedAt).toLocaleDateString();
        text += `\u2022 **${playlist.name}** - ${playlist.tracks.length} track${playlist.tracks.length !== 1 ? "s" : ""} (updated ${date})
`;
      }
      if (!isDM) {
        text += `
\u{1F4A1} **Tip:** You can manage playlists in DMs to keep group chats clean! Just send me a DM and I'll help you manage your playlists privately.`;
      }
      await callback({
        text,
        source: message.content.source
      });
      return { success: true, text };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger5.error("Error listing playlists:", errorMessage);
      await callback({
        text: `I encountered an error while listing your playlists. ${errorMessage}`,
        source: message.content.source
      });
      return { success: false, error: errorMessage };
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "show my playlists"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "**Your Playlists (2):**\n\n\u2022 **My Favorites** - 5 tracks (updated 12/25/2024)\n\u2022 **Workout Mix** - 10 tracks (updated 12/24/2024)"
        }
      }
    ]
  ]
};
var listPlaylists_default = listPlaylists;

// src/actions/loadPlaylist.ts
import {
  ChannelType as ChannelType3,
  logger as logger6
} from "@elizaos/core";
var MUSIC_SERVICE_NAME = "music";
var MUSIC_LIBRARY_SERVICE_NAME3 = "musicLibrary";
var loadPlaylist = {
  name: "LOAD_PLAYLIST",
  similes: [
    "PLAY_PLAYLIST",
    "LOAD_QUEUE",
    "RESTORE_PLAYLIST",
    "PLAY_SAVED_PLAYLIST"
  ],
  description: "Load a saved playlist and add all tracks to the queue. Works best in DMs to avoid flooding group chats.",
  validate: async (_runtime, message, _state) => {
    if (message.content.source !== "discord") {
      return false;
    }
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!callback) {
      return { success: false, error: "Missing callback" };
    }
    const musicService = runtime.getService(
      MUSIC_SERVICE_NAME
    );
    if (!musicService) {
      await callback({
        text: "Music service is not available.",
        source: message.content.source
      });
      return { success: false, error: "Music service unavailable" };
    }
    const musicLibrary = runtime.getService(
      MUSIC_LIBRARY_SERVICE_NAME3
    );
    if (!musicLibrary) {
      await callback({
        text: "Music library service is not available.",
        source: message.content.source
      });
      return { success: false, error: "Music library service unavailable" };
    }
    const room = state?.data?.room || await runtime.getRoom(message.roomId);
    const currentServerId = room?.serverId;
    if (!currentServerId) {
      await callback({
        text: "I could not determine which server you are in.",
        source: message.content.source
      });
      return { success: false, error: "Missing server id" };
    }
    const userId = message.entityId;
    if (!userId) {
      await callback({
        text: "I could not determine your user ID.",
        source: message.content.source
      });
      return { success: false, error: "Missing user id" };
    }
    try {
      const playlists = await musicLibrary.loadPlaylists(userId);
      if (playlists.length === 0) {
        await callback({
          text: "You don't have any saved playlists. Save a queue first using 'save playlist'.",
          source: message.content.source
        });
        return { success: false, error: "No playlists available" };
      }
      const messageText = message.content.text || "";
      let playlistName;
      const nameMatch = messageText.match(
        /(?:load|play|restore).*?playlist.*?(?:named|called)?\s*["']?([^"']+)["']?/i
      );
      if (nameMatch) {
        playlistName = nameMatch[1]?.trim();
      } else {
        const quotedMatch = messageText.match(/["']([^"']+)["']/);
        if (quotedMatch) {
          playlistName = quotedMatch[1]?.trim();
        }
      }
      let selectedPlaylist;
      if (playlistName) {
        selectedPlaylist = playlists.find(
          (playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase()
        );
        if (!selectedPlaylist) {
          await callback({
            text: `I couldn't find a playlist named "${playlistName}". Your playlists: ${playlists.map((p) => `"${p.name}"`).join(", ")}`,
            source: message.content.source
          });
          return { success: false, error: "Playlist not found" };
        }
      } else {
        selectedPlaylist = [...playlists].sort(
          (a, b) => b.updatedAt - a.updatedAt
        )[0];
      }
      for (const track of selectedPlaylist.tracks) {
        await musicService.addTrack(currentServerId, {
          url: track.url,
          title: track.title,
          duration: track.duration,
          requestedBy: userId
        });
      }
      const isDM = room?.type === ChannelType3.DM;
      const addedCount = selectedPlaylist.tracks.length;
      let responseText = `Loaded playlist "${selectedPlaylist.name}" and added ${addedCount} track${addedCount !== 1 ? "s" : ""} to the queue.`;
      if (!isDM) {
        responseText += " Tip: You can manage playlists in DMs to keep group chats clean.";
      }
      await callback({
        text: responseText,
        source: message.content.source
      });
      return { success: true, text: responseText };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger6.error("Error loading playlist:", errorMessage);
      await callback({
        text: `I encountered an error while loading the playlist. ${errorMessage}`,
        source: message.content.source
      });
      return { success: false, error: errorMessage };
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "load my playlist"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: 'Loaded playlist "My Favorites" and added 5 tracks to the queue.'
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: 'play playlist "Workout Mix"'
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: 'Loaded playlist "Workout Mix" and added 10 tracks to the queue.'
        }
      }
    ]
  ]
};
var loadPlaylist_default = loadPlaylist;

// src/actions/playMusicQuery.ts
import {
  logger as logger7,
  ModelType
} from "@elizaos/core";
function getModelText(response) {
  return typeof response === "string" ? response : null;
}
function summarizeSearchResults(results) {
  return results.slice(0, 3).map((result) => result.description || result.snippet || "").join("\n");
}
var analyzeMusicQuery = async (runtime, messageText) => {
  try {
    const prompt = `Analyze this music-related request and extract the intent. Be comprehensive - this could be any type of music query.

Message: "${messageText}"

Determine:
1. Does this need research (Wikipedia/music databases) or can it be directly searched on YouTube?
2. What type of query is this? Choose from:
   
   ARTIST-SPECIFIC:
   - "first_single": First/debut single of an artist
   - "latest_song": Most recent song
   - "similar_artist": Similar/related artists
   - "debut_album": Songs from debut album
   - "popular_song": Popular/hit song from artist
   - "nth_album": Specific album by number (2nd album, third album, etc)
   
   TEMPORAL:
   - "era": Music from an era (80s, 90s, 2000s, etc)
   - "decade": Music from a decade
   - "year": Music from a specific year
   
   GENRE/MOOD/VIBE:
   - "genre": Specific genre (jazz, rock, hip hop, etc)
   - "mood": Mood-based (sad, happy, angry, etc)
   - "vibe": Vibe-based (chill, energetic, dark, uplifting, etc)
   
   ACTIVITY:
   - "activity": General activity music
   - "workout": Workout/gym music
   - "study": Study/focus music
   - "party": Party music
   - "chill": Chill/relaxing music
   
   CHARTS/POPULARITY:
   - "chart": Chart hits (Billboard, etc)
   - "top_hits": Top hits
   - "trending": Viral/trending songs
   
   ALBUM:
   - "album": Play from an album
   - "album_track": Specific track from album
   - "full_album": Play entire album
   
   MEDIA:
   - "movie_soundtrack": From a movie
   - "game_soundtrack": From a video game
   - "tv_theme": TV show theme
   
   LYRICS/TOPIC:
   - "lyrics_based": Based on lyrics or themes
   - "topic": Songs about a topic
   
   VERSIONS:
   - "cover": Cover version
   - "remix": Remix
   - "acoustic": Acoustic version
   - "live": Live performance
   
   SPECIFIC:
   - "specific_track": Track by number (track 3, etc)
   - "direct_search": Can search directly

3. Extract relevant details:
   - artist: Artist name if mentioned
   - album: Album name if mentioned
   - song: Song name if mentioned
   - genre: Genre if mentioned
   - mood: Mood if mentioned (happy, sad, energetic, chill, etc)
   - decade: Decade if mentioned (80s, 90s, 2000s, etc)
   - year: Specific year if mentioned
   - keywords: Other important keywords
   - modifier: If asking for specific version (cover, remix, acoustic, live, instrumental)

Respond with ONLY a JSON object:
{
    "needsResearch": true/false,
    "queryType": "[one of the types above]",
    "artist": "artist name if mentioned",
    "album": "album name if mentioned",
    "song": "song name if mentioned",
    "genre": "genre if mentioned",
    "mood": "mood if mentioned",
    "decade": "decade if mentioned",
    "year": "year if mentioned",
    "keywords": "other important keywords",
    "modifier": "cover|remix|acoustic|live|instrumental if requested",
    "searchQuery": "if direct_search, the query to use"
}`;
    const rawResponse = await runtime.useModel(ModelType.TEXT_SMALL, {
      prompt
    });
    const response = getModelText(rawResponse);
    if (!response) {
      return null;
    }
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }
    const intent = JSON.parse(jsonMatch[0]);
    return intent;
  } catch (error) {
    logger7.error(
      "Error analyzing music query:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};
var researchMusicInfo = async (runtime, intent) => {
  try {
    const wikipediaService = runtime.getService(
      "wikipedia"
    );
    const musicInfoService = runtime.getService(
      "musicInfo"
    );
    const webSearchService = runtime.getService(
      "webSearch"
    );
    logger7.debug(
      `Researching music info: ${intent.queryType} for ${intent.artist || intent.genre || intent.mood || "query"}`
    );
    let searchQuery = null;
    switch (intent.queryType) {
      case "first_single":
      case "debut_album": {
        if (!intent.artist) break;
        if (wikipediaService?.getArtistInfo) {
          const artistInfo = await wikipediaService.getArtistInfo(
            intent.artist
          );
          if (artistInfo?.discography) {
            const prompt = `From this artist discography, what was their first ${intent.queryType === "first_single" ? "single" : "album"}?

Discography: ${JSON.stringify(artistInfo.discography).substring(0, 2e3)}

Respond with ONLY the song/album name, nothing else.`;
            const firstRelease = getModelText(
              await runtime.useModel(ModelType.TEXT_SMALL, { prompt })
            );
            if (firstRelease) {
              searchQuery = `${intent.artist} ${firstRelease.trim()}`;
            }
          }
        }
        if (!searchQuery && webSearchService) {
          const searchResults = await webSearchService.search(
            `${intent.artist} ${intent.queryType === "first_single" ? "first single debut" : "debut album first album"}`
          );
          if (searchResults && searchResults.length > 0) {
            const prompt = `From these search results, what was ${intent.artist}'s ${intent.queryType === "first_single" ? "first single" : "debut album"}?

Results: ${summarizeSearchResults(searchResults)}

Respond with ONLY the song/album name, nothing else.`;
            const answer = getModelText(
              await runtime.useModel(ModelType.TEXT_SMALL, { prompt })
            );
            if (answer) {
              searchQuery = `${intent.artist} ${answer.trim()}`;
            }
          }
        }
        break;
      }
      case "nth_album": {
        if (!intent.artist || !intent.keywords) break;
        const numberMatch = intent.keywords.match(
          /(\d+)(?:st|nd|rd|th)|second|third|fourth|fifth/i
        );
        if (!numberMatch) break;
        if (webSearchService) {
          const searchResults = await webSearchService.search(
            `${intent.artist} ${intent.keywords} album discography`
          );
          if (searchResults && searchResults.length > 0) {
            const prompt = `From these search results, what was ${intent.artist}'s ${intent.keywords} album?

Results: ${summarizeSearchResults(searchResults)}

Respond with ONLY the album name, nothing else.`;
            const answer = getModelText(
              await runtime.useModel(ModelType.TEXT_SMALL, { prompt })
            );
            if (answer) {
              searchQuery = `${intent.artist} ${answer.trim()}`;
            }
          }
        }
        break;
      }
      case "similar_artist": {
        if (!intent.artist) break;
        if (wikipediaService?.getArtistInfo) {
          const artistInfo = await wikipediaService.getArtistInfo(
            intent.artist
          );
          if (artistInfo?.similarArtists && artistInfo.similarArtists.length > 0) {
            const similar = artistInfo.similarArtists[Math.floor(Math.random() * artistInfo.similarArtists.length)];
            searchQuery = `${similar} popular song`;
            logger7.info(`Found similar artist: ${similar}`);
          }
        }
        if (!searchQuery && musicInfoService?.getArtistInfo) {
          const artistInfo = await musicInfoService.getArtistInfo(
            intent.artist
          );
          if (artistInfo?.similarArtists && artistInfo.similarArtists.length > 0) {
            const similar = artistInfo.similarArtists[0];
            searchQuery = `${similar} popular song`;
            logger7.info(`Found similar artist: ${similar}`);
          }
        }
        break;
      }
      case "latest_song": {
        if (!intent.artist) break;
        searchQuery = `${intent.artist} latest song new ${(/* @__PURE__ */ new Date()).getFullYear()}`;
        break;
      }
      case "popular_song": {
        if (!intent.artist) break;
        searchQuery = `${intent.artist} most popular song hit`;
        break;
      }
      case "movie_soundtrack":
      case "game_soundtrack":
      case "tv_theme": {
        if (!intent.keywords) break;
        const mediaType = intent.queryType.replace("_soundtrack", "").replace("_theme", "");
        searchQuery = `${intent.keywords} ${mediaType} ${intent.queryType.includes("theme") ? "theme" : "soundtrack"}`;
        break;
      }
      case "era":
      case "decade": {
        const timeKeyword = intent.decade || intent.year || intent.keywords;
        if (!timeKeyword) break;
        const genrePrefix = intent.genre ? `${intent.genre} ` : "";
        searchQuery = `${genrePrefix}${timeKeyword} hits popular songs`;
        break;
      }
      case "genre": {
        if (!intent.genre && !intent.keywords) break;
        const genre = intent.genre || intent.keywords;
        searchQuery = `${genre} music popular`;
        break;
      }
      case "mood":
      case "vibe": {
        const mood = intent.mood || intent.keywords;
        if (!mood) break;
        searchQuery = `${mood} music songs`;
        break;
      }
      case "workout":
      case "study":
      case "party":
      case "chill":
      case "activity": {
        const activity = intent.queryType === "activity" ? intent.keywords : intent.queryType;
        searchQuery = `${activity} music playlist`;
        break;
      }
      case "chart":
      case "top_hits":
      case "trending": {
        const chartType = intent.keywords || intent.queryType;
        searchQuery = `${chartType} ${(/* @__PURE__ */ new Date()).getFullYear()} popular songs`;
        break;
      }
      case "lyrics_based":
      case "topic": {
        if (!intent.keywords) break;
        searchQuery = `songs about ${intent.keywords}`;
        break;
      }
      case "album_track":
      case "specific_track": {
        if (!intent.album && !intent.artist) break;
        const trackInfo = intent.keywords || "";
        searchQuery = `${intent.artist || ""} ${intent.album || ""} ${trackInfo}`.trim();
        break;
      }
      case "full_album": {
        if (!intent.album && !intent.artist) break;
        searchQuery = `${intent.artist || ""} ${intent.album || ""} full album`;
        break;
      }
    }
    if (searchQuery && intent.modifier) {
      searchQuery = `${searchQuery} ${intent.modifier}`;
    }
    return searchQuery;
  } catch (error) {
    logger7.error(
      "Error researching music info:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};
var playMusicQuery = {
  name: "PLAY_MUSIC_QUERY",
  similes: [
    "SMART_PLAY",
    "RESEARCH_AND_PLAY",
    "FIND_AND_PLAY",
    "INTELLIGENT_MUSIC_SEARCH"
  ],
  description: "Handle any complex music query that requires understanding and research. Supports: artist queries (first single, latest song, similar artists, popular songs, nth album), temporal (80s, 90s, specific years), genre/mood/vibe, activities (workout, study, party), charts/trending, albums, movie/game/TV soundtracks, lyrics/topics, versions (covers, remixes, acoustic, live), and more. Uses Wikipedia, music databases, and web search to find the right music.",
  validate: async (_runtime, message, _state) => {
    if (message.content.source !== "discord") {
      return false;
    }
    const messageText = (message.content.text || "").toLowerCase();
    if (messageText.includes("youtube.com/") || messageText.includes("youtu.be/")) {
      return false;
    }
    const researchKeywords = [
      // Artist-specific
      "first single",
      "debut single",
      "first song",
      "debut album",
      "first album",
      "latest song",
      "newest song",
      "recent song",
      "new song",
      "new music",
      "something like",
      "similar to",
      "sounds like",
      "reminds me of",
      "in the style of",
      "most popular",
      "biggest hit",
      "best song",
      "top song",
      "second album",
      "third album",
      "2nd album",
      "3rd album",
      "nth album",
      // Temporal
      "80s",
      "90s",
      "2000s",
      "70s",
      "60s",
      "from the",
      // Genre/Mood
      "genre:",
      "chill",
      "vibes",
      "mood",
      "upbeat",
      "sad",
      "happy",
      "energetic",
      // Activity
      "workout",
      "gym",
      "study",
      "focus",
      "party",
      "driving",
      "sleep",
      // Charts
      "top",
      "chart",
      "billboard",
      "trending",
      "viral",
      "popular now",
      // Media
      "soundtrack",
      "theme song",
      "theme from",
      "from the movie",
      "from the game",
      "from the show",
      "tv show",
      // Lyrics/Topic
      "songs about",
      "with lyrics",
      "that mentions",
      // Versions
      "cover of",
      "remix of",
      "acoustic version",
      "live version",
      "live at",
      "instrumental",
      // Album
      "from the album",
      "track",
      "entire album",
      "full album",
      "whole album"
    ];
    const needsResearch = researchKeywords.some(
      (keyword) => messageText.includes(keyword)
    );
    const simplePatterns = [
      /play\s+(some\s+)?(jazz|rock|pop|hip hop|rap|metal|electronic|indie|folk|country|classical|blues)/i,
      /play\s+(something\s+)?(chill|upbeat|sad|happy|energetic|mellow|intense)/i
    ];
    return needsResearch || simplePatterns.some((pattern) => pattern.test(messageText));
  },
  handler: async (runtime, message, state, _options, callback) => {
    const messageText = message.content.text || "";
    try {
      await callback({
        text: "\u{1F50D} Let me figure out what you want...",
        source: message.content.source
      });
      const intent = await analyzeMusicQuery(runtime, messageText);
      if (!intent) {
        await callback({
          text: "I couldn't understand your music request. Try being more specific?",
          source: message.content.source
        });
        return;
      }
      logger7.info(`Music query intent: ${JSON.stringify(intent)}`);
      let finalSearchQuery = null;
      if (intent.needsResearch && intent.queryType !== "direct_search") {
        const researchResult = await researchMusicInfo(runtime, intent);
        if (!researchResult) {
          await callback({
            text: "I couldn't resolve that music query from the available research services. Try a more direct song, artist, or album request.",
            source: message.content.source
          });
          return;
        }
        finalSearchQuery = researchResult;
      } else {
        if (intent.searchQuery) {
          finalSearchQuery = intent.searchQuery;
        } else {
          const parts = [
            intent.artist,
            intent.song,
            intent.album,
            intent.genre,
            intent.mood,
            intent.keywords
          ].filter(Boolean);
          finalSearchQuery = parts.length > 0 ? parts.join(" ") : messageText;
          if (intent.modifier) {
            finalSearchQuery = `${finalSearchQuery} ${intent.modifier}`;
          }
        }
      }
      if (!finalSearchQuery) {
        await callback({
          text: "I couldn't figure out what to search for. Can you rephrase your request?",
          source: message.content.source
        });
        return;
      }
      logger7.info(`Final search query: ${finalSearchQuery}`);
      const youtubeSearch = runtime.getService(
        "youtubeSearch"
      );
      if (!youtubeSearch) {
        await callback({
          text: "YouTube search service is not available.",
          source: message.content.source
        });
        return;
      }
      const results = await youtubeSearch.search(finalSearchQuery, {
        limit: 1
      });
      if (!results || results.length === 0) {
        await callback({
          text: `I couldn't find anything matching "${finalSearchQuery}". Try being more specific?`,
          source: message.content.source
        });
        return;
      }
      const topResult = results[0];
      logger7.info(`Found: ${topResult.title} (${topResult.url})`);
      const musicService = runtime.getService(
        "music"
      );
      if (!musicService) {
        await callback({
          text: "Music service is not available.",
          source: message.content.source
        });
        return;
      }
      const room = state.data?.room || await runtime.getRoom(message.roomId);
      const guildId = room?.serverId;
      if (!guildId) {
        await callback({
          text: "Could not determine Discord server. Make sure you're messaging from a server channel.",
          source: message.content.source
        });
        return;
      }
      const requestEntityId = message.entityId;
      await musicService.addTrack(guildId, {
        url: topResult.url,
        title: topResult.title,
        duration: topResult.duration,
        requestedBy: requestEntityId
      });
      await callback({
        text: `\u{1F3B5} Queued: **${topResult.title}**`,
        source: message.content.source
      });
    } catch (error) {
      logger7.error(
        "Error in playMusicQuery:",
        error instanceof Error ? error.message : String(error)
      );
      await callback({
        text: "I ran into an issue trying to find that music.",
        source: message.content.source
      });
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Play the strokes first single"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Let me look that up!",
          actions: ["PLAY_MUSIC_QUERY"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Play something like radiohead"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "I'll find a similar artist!",
          actions: ["PLAY_MUSIC_QUERY"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Play some 80s synth pop"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Finding 80s synth pop for you!",
          actions: ["PLAY_MUSIC_QUERY"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Play workout music"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Let's get you pumped up!",
          actions: ["PLAY_MUSIC_QUERY"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Play a cover of wonderwall"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Looking for a cover version!",
          actions: ["PLAY_MUSIC_QUERY"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Play the Inception soundtrack"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Finding that soundtrack!",
          actions: ["PLAY_MUSIC_QUERY"]
        }
      }
    ]
  ]
};
var playMusicQuery_default = playMusicQuery;

// src/actions/savePlaylist.ts
import {
  ChannelType as ChannelType4,
  logger as logger8
} from "@elizaos/core";
var MUSIC_SERVICE_NAME2 = "music";
var MUSIC_LIBRARY_SERVICE_NAME4 = "musicLibrary";
var savePlaylist2 = {
  name: "SAVE_PLAYLIST",
  similes: [
    "SAVE_QUEUE",
    "CREATE_PLAYLIST",
    "STORE_PLAYLIST",
    "SAVE_MUSIC_LIST"
  ],
  description: "Save the current music queue as a playlist for the user. Works best in DMs to avoid flooding group chats.",
  validate: async (_runtime, message, _state) => {
    if (message.content.source !== "discord") {
      return false;
    }
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!callback) {
      return { success: false, error: "Missing callback" };
    }
    const musicService = runtime.getService(
      MUSIC_SERVICE_NAME2
    );
    if (!musicService) {
      await callback({
        text: "Music service is not available.",
        source: message.content.source
      });
      return { success: false, error: "Music service unavailable" };
    }
    const musicLibrary = runtime.getService(
      MUSIC_LIBRARY_SERVICE_NAME4
    );
    if (!musicLibrary) {
      await callback({
        text: "Music library service is not available.",
        source: message.content.source
      });
      return { success: false, error: "Music library service unavailable" };
    }
    const room = state?.data?.room || await runtime.getRoom(message.roomId);
    const currentServerId = room?.serverId;
    if (!currentServerId) {
      await callback({
        text: "I could not determine which server you are in.",
        source: message.content.source
      });
      return { success: false, error: "Missing server id" };
    }
    const queue = musicService.getQueueList(currentServerId);
    const currentTrack = musicService.getCurrentTrack(currentServerId);
    if (queue.length === 0 && !currentTrack) {
      await callback({
        text: "The queue is empty. Add some tracks before saving a playlist.",
        source: message.content.source
      });
      return { success: false, error: "Queue is empty" };
    }
    const messageText = message.content.text || "";
    const nameMatch = messageText.match(
      /(?:save|create|store).*?playlist.*?(?:named|called|as)?\s*["']?([^"']+)["']?/i
    );
    const playlistName = nameMatch?.[1]?.trim() || `Playlist ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`;
    try {
      const userId = message.entityId;
      if (!userId) {
        await callback({
          text: "I could not determine your user ID.",
          source: message.content.source
        });
        return { success: false, error: "Missing user id" };
      }
      const tracks = [];
      if (currentTrack) {
        tracks.push({
          url: currentTrack.url,
          title: currentTrack.title,
          duration: currentTrack.duration
        });
      }
      for (const track of queue) {
        tracks.push({
          url: track.url,
          title: track.title,
          duration: track.duration
        });
      }
      const playlist = {
        name: playlistName,
        tracks
      };
      const savedPlaylist = await musicLibrary.savePlaylist(userId, playlist);
      const isDM = room?.type === ChannelType4.DM;
      let responseText = `Saved playlist "${savedPlaylist.name}" with ${savedPlaylist.tracks.length} track${savedPlaylist.tracks.length !== 1 ? "s" : ""}.`;
      if (!isDM) {
        responseText += " Tip: You can manage playlists in DMs to keep group chats clean.";
      }
      await callback({
        text: responseText,
        source: message.content.source
      });
      return { success: true, text: responseText };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger8.error("Error saving playlist:", errorMessage);
      await callback({
        text: `I encountered an error while saving the playlist. ${errorMessage}`,
        source: message.content.source
      });
      return { success: false, error: errorMessage };
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "save this as a playlist"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: 'Saved playlist "Playlist 12/25/2024" with 5 tracks.'
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: 'create a playlist called "My Favorites"'
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: 'Saved playlist "My Favorites" with 3 tracks.'
        }
      }
    ]
  ]
};
var savePlaylist_default = savePlaylist2;

// src/actions/searchYouTube.ts
import {
  logger as logger9
} from "@elizaos/core";
var extractSearchQuery = (messageText) => {
  if (!messageText) return null;
  const patterns = [
    /(?:find|search|look up|get|show me)(?:\s+(?:the|a))?\s+(?:youtube|video|song|music)?\s*(?:link|url)?\s+for\s+(.+)/i,
    /(?:what's|what is|whats)\s+(?:the\s+)?(?:youtube|video|song)?\s*(?:link|url)?\s+for\s+(.+)/i,
    /(?:can you|could you|please)\s+(?:find|search|get|show me)\s+(?:the\s+)?(?:youtube|video|song)?\s*(?:link|url)?\s+(?:for\s+)?(.+)/i,
    /youtube\s+search\s+(?:for\s+)?(.+)/i,
    /search\s+youtube\s+(?:for\s+)?(.+)/i
  ];
  for (const pattern of patterns) {
    const match = messageText.match(pattern);
    if (match?.[1]) {
      const query = match[1].trim();
      if (query.length >= 3) {
        return query;
      }
    }
  }
  return null;
};
var searchYouTube = {
  name: "SEARCH_YOUTUBE",
  similes: [
    "FIND_YOUTUBE",
    "SEARCH_YOUTUBE_VIDEO",
    "FIND_SONG",
    "SEARCH_MUSIC",
    "GET_YOUTUBE_LINK",
    "LOOKUP_YOUTUBE"
  ],
  description: "Search YouTube for a song or video and return the link. Use this when a user asks to find or search for a YouTube video or song without providing a specific URL.",
  validate: async (_runtime, message, _state) => {
    const messageText = message.content.text || "";
    const searchQuery = extractSearchQuery(messageText);
    return !!searchQuery;
  },
  handler: async (runtime, message, _state, _options, callback) => {
    const messageText = message.content.text || "";
    const searchQuery = extractSearchQuery(messageText);
    if (!searchQuery) {
      await callback({
        text: "I couldn't understand what you want me to search for. Please try asking like: 'Find the YouTube link for Surefire by Wilderado' (at least 3 characters)",
        source: message.content.source
      });
      return { success: false, error: "Missing search query" };
    }
    try {
      const youtubeSearchService = runtime.getService(
        "youtubeSearch"
      );
      if (!youtubeSearchService) {
        throw new Error("YouTube search service is not available");
      }
      logger9.debug(`Searching YouTube for: ${searchQuery}`);
      const searchResults = await youtubeSearchService.search(searchQuery, {
        limit: 5
      });
      if (!searchResults || searchResults.length === 0) {
        await callback({
          text: `I couldn't find any YouTube videos for "${searchQuery}". Try rephrasing your search or being more specific.`,
          source: message.content.source
        });
        return { success: false, error: "No YouTube results found" };
      }
      const topResult = searchResults[0];
      const url = topResult.url;
      const title = topResult.title;
      const channel = topResult.channel || "Unknown Channel";
      let responseText = `Found it. Here's "${title}" by ${channel}:
${url}

`;
      if (searchResults.length > 1) {
        responseText += "Other results:\n";
        for (let i = 1; i < Math.min(3, searchResults.length); i++) {
          const result = searchResults[i];
          const resultTitle = result.title;
          const resultChannel = result.channel || "Unknown";
          responseText += `${i + 1}. ${resultTitle} by ${resultChannel}
   ${result.url}
`;
        }
      }
      await runtime.createMemory(
        {
          entityId: message.entityId,
          agentId: message.agentId,
          roomId: message.roomId,
          content: {
            source: message.content.source,
            thought: `Searched YouTube for: ${searchQuery}, found: ${title}`,
            actions: ["SEARCH_YOUTUBE"]
          },
          metadata: {
            type: "custom",
            actionName: "SEARCH_YOUTUBE",
            searchQuery,
            resultUrl: url,
            resultTitle: title,
            resultChannel: channel
          }
        },
        "messages"
      );
      await callback({
        text: responseText,
        actions: ["SEARCH_YOUTUBE_RESPONSE"],
        source: message.content.source
      });
      return {
        success: true,
        text: responseText,
        data: {
          searchQuery,
          resultUrl: url,
          resultTitle: title,
          resultChannel: channel
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger9.error("Error searching YouTube:", errorMessage);
      await callback({
        text: `I encountered an error while searching YouTube: ${errorMessage}.`,
        source: message.content.source
      });
      return { success: false, error: errorMessage };
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Find the YouTube link for Surefire by Wilderado"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "I'll search for that on YouTube!",
          actions: ["SEARCH_YOUTUBE"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you find the youtube link for Never Gonna Give You Up?"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Let me search YouTube for that song!",
          actions: ["SEARCH_YOUTUBE"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "DJynAI, search youtube for bohemian rhapsody"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "I'll find that for you on YouTube!",
          actions: ["SEARCH_YOUTUBE"]
        }
      }
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "What's the YouTube link for Blinding Lights by The Weeknd?"
        }
      },
      {
        name: "{{name2}}",
        content: {
          text: "Searching YouTube for that track!",
          actions: ["SEARCH_YOUTUBE"]
        }
      }
    ]
  ]
};
var searchYouTube_default = searchYouTube;

// src/providers/musicInfoInstructions.ts
var musicInfoInstructionsProvider = {
  name: "MUSIC_INFO_INSTRUCTIONS",
  description: "Provides comprehensive music metadata and research capabilities documentation",
  position: 5,
  // Early position for capability awareness
  get: async (runtime, message, _state) => {
    const messageText = (message.content?.text || "").toLowerCase();
    const needsInstructions = messageText.includes("help") || messageText.includes("what can you tell me about") || messageText.includes("tell me about") || messageText.includes("information about") || messageText.includes("info about") || messageText.includes("who is") || messageText.includes("who are") || messageText.includes("what is") || messageText.includes("artist info") || messageText.includes("song info") || messageText.includes("album info") || messageText.includes("music info") || messageText.includes("capabilities") || messageText.includes("features") || messageText.includes("what do you know");
    if (!needsInstructions) {
      return { text: "", data: {}, values: {} };
    }
    const instructions = `# Music Information & Research System

## What I Can Tell You About Music

### Track Information
I can provide detailed information about any song:
- **Song title and artist**
- **Album name and release year**
- **Genre and style**
- **Track duration**
- **Description and background**
- **Interesting facts and trivia**
- **Chart performance**
- **Production details**

**Examples:**
- "Tell me about Bohemian Rhapsody"
- "What can you tell me about this song?"
- "Give me information about the current track"
- "What's playing right now?"

### Artist Information
I can provide comprehensive artist details:
- **Artist biography and history**
- **Musical genre and style**
- **Notable works and albums**
- **Similar/related artists**
- **Influences and legacy**
- **Career highlights**
- **Awards and achievements**

**Examples:**
- "Tell me about Queen"
- "Who is Radiohead?"
- "Give me info about the artist"
- "What's their background?"

### Album Information
I can provide album details:
- **Album title and artist**
- **Release date and year**
- **Track listing**
- **Genre and style**
- **Critical reception**
- **Background and recording**
- **Notable tracks**

**Examples:**
- "Tell me about OK Computer"
- "What's this album about?"
- "Info on Is This It by The Strokes"

## Data Sources

I integrate with multiple music databases and APIs:
- **MusicBrainz**: Comprehensive metadata (free, always available)
  - Artists, albums, recordings, ISRCs
  - Genres, tags, and relationships
  - Cover art via Cover Art Archive
- **Last.fm**: Listening stats, similar artists, tags (requires API key)
  - Similar artist recommendations
  - Genre tags and classifications
  - Popularity metrics
- **Wikipedia**: Artist bios, discographies, detailed histories
  - Comprehensive artist biographies
  - Discographies and career timelines
  - Cultural context and influence
- **Genius**: Lyrics and annotations (requires API key)
  - Song lyrics with annotations
  - Song meanings and interpretations
  - Artist information
- **TheAudioDB**: High-quality artwork and detailed info (requires API key)
  - High-resolution artist images
  - Album artwork
  - Detailed descriptions
- **Web Search**: Real-time information gathering
  - Latest news and releases
  - Concert information
  - Current events

## Smart Features

### Automatic Context Injection
When you're listening to music or discussing songs, I automatically:
- Detect music references in conversation
- Look up information about mentioned artists/songs
- Provide relevant context without being asked
- Enrich DJ introductions with interesting facts
- Inject metadata into music player context

### Entity Detection
I can understand natural language references:
- "this song" \u2192 Currently playing track
- "that artist" \u2192 Previously mentioned artist
- "their album" \u2192 Artist's album from context
- "the band" \u2192 Current or contextual band
- "it" / "that" \u2192 Last mentioned music entity

### Intelligent Query Analysis
I understand complex music queries:
- **Artist-specific**: "first single", "latest song", "popular tracks"
- **Temporal**: "80s music", "2000s hits", "songs from 1995"
- **Genre/Mood**: "sad songs", "energetic music", "chill vibes"
- **Activity**: "workout music", "study music", "party tracks"
- **Versions**: "acoustic version", "live performance", "remix"
- **Album queries**: "track 3 from OK Computer", "songs from debut album"
- **Soundtracks**: "Inception soundtrack", "Zelda music"

### Caching & Performance
- All lookups are cached for 1 hour
- Repeated queries are instant (< 10ms)
- Queries use the configured authoritative service path for the requested data
- Missing or unavailable sources fail closed instead of silently degrading
- Rate limiting and retry logic built-in
- Service health monitoring

## Integration with DJ Features

### DJ Track Introductions
When DJ intros are enabled, I provide:
- Interesting facts about the song
- Artist background and trivia
- Album context and significance
- Release history and chart performance
- Production and recording details

### Post-Track Commentary
After songs finish, I can share:
- Additional facts and trivia
- Context about what's coming next
- Connections to other music
- Artist career highlights

## Service Status

Check which music services are available:
- **MusicBrainz**: Always available (no API key needed)
- **Last.fm**: ${runtime.getSetting("LASTFM_API_KEY") ? "\u2705 Configured" : "\u274C Not configured"}
- **Genius**: ${runtime.getSetting("GENIUS_API_KEY") ? "\u2705 Configured" : "\u274C Not configured"}
- **TheAudioDB**: ${runtime.getSetting("THEAUDIODB_API_KEY") ? "\u2705 Configured" : "\u274C Not configured"}
- **Wikipedia**: \u2705 Always available

${!runtime.getSetting("LASTFM_API_KEY") && !runtime.getSetting("GENIUS_API_KEY") ? "\n\u{1F4A1} **Tip**: Configure API keys for enhanced features (Last.fm, Genius, TheAudioDB)" : ""}

## How to Use

### During Playback
Just ask naturally:
- "Who's this by?"
- "What album is this from?"
- "Tell me about this artist"
- "When was this released?"

### For Research
Ask about any music:
- "Tell me about [artist/song/album]"
- "What can you tell me about [music]?"
- "Give me info on [artist]"
- "Who are [band]?"

### For Discovery
Learn about similar music:
- "What artists are like [artist]?"
- "Similar bands to [band]"
- "Music in the same style as [artist]"

## Additional Features

### YouTube Integration
- **Smart search**: Automatically searches YouTube for tracks
- **URL extraction**: Parses and validates YouTube URLs
- **Query parsing**: Detects artist, genre, mood intents
- **Multiple results**: Returns top matches with metadata

### Music Storage & Archival
- **High-quality storage**: Store original audio files
- **Organized library**: Artist/Album/Track hierarchy
- **Metadata indexing**: Full searchable metadata
- **Play history**: Track what's been played and when
- **Request tracking**: Log who requested which tracks

### User Preferences & Learning
- **Favorite tracking**: Learn your favorite tracks and artists
- **Genre preferences**: Track genre preferences over time
- **Dislike tracking**: Remember what you don't like
- **Room preferences**: Aggregate preferences across users
- **Smart recommendations**: Use preferences for better suggestions

## Automatic Features

I provide music info automatically when:
- \u2705 DJ track introductions are enabled
- \u2705 You ask about music in conversation
- \u2705 You reference artists or songs naturally
- \u2705 Music entities are detected in messages
- \u2705 Trivia mode is activated
- \u2705 Post-track commentary is enabled

## Performance

- **MusicBrainz lookups**: 200-500ms (first time)
- **Cached results**: < 10ms (instant)
- **Wikipedia lookups**: 500-1000ms
- **Multiple sources**: Tried in parallel for speed
- **Smart caching**: 1-hour TTL for all data
- **Rate limiting**: Built-in to prevent API throttling
- **Retry logic**: Automatic retry with exponential backoff

---

Remember: I'm always listening for music references in conversation and will provide relevant information when helpful!
`;
    return {
      text: instructions,
      data: {
        musicBrainzConfigured: true,
        lastFmConfigured: !!runtime.getSetting("LASTFM_API_KEY"),
        geniusConfigured: !!runtime.getSetting("GENIUS_API_KEY"),
        theAudioDbConfigured: !!runtime.getSetting("THEAUDIODB_API_KEY"),
        wikipediaConfigured: true,
        source: "musicInfoInstructions"
      },
      values: {
        hasMusicInfoCapabilities: true,
        supportsMultipleSources: true,
        supportsCaching: true,
        supportsEntityDetection: true
      }
    };
  }
};

// src/providers/musicInfoProvider.ts
import { logger as logger10 } from "@elizaos/core";
var musicInfoProvider = {
  name: "MUSIC_INFO",
  description: "Provides information about tracks, artists, and albums",
  position: 10,
  // Position after basic providers but before complex ones
  get: async (runtime, message, _state) => {
    logger10.debug("[MUSIC_INFO Provider] Starting provider execution");
    const musicInfoService = runtime.getService(
      "musicInfo"
    );
    if (!musicInfoService) {
      logger10.debug("[MUSIC_INFO Provider] MusicInfoService not available");
      return { text: "", data: {}, values: {} };
    }
    const messageText = message.content?.text || "";
    if (!messageText || messageText.trim().length === 0) {
      logger10.debug("[MUSIC_INFO Provider] Empty message text");
      return { text: "", data: {}, values: {} };
    }
    logger10.debug(
      `[MUSIC_INFO Provider] Processing message: "${messageText.substring(0, 100)}${messageText.length > 100 ? "..." : ""}"`
    );
    const musicInfo = [];
    const entityDetectionService = runtime.getService(
      "musicEntityDetection"
    );
    if (!entityDetectionService) {
      throw new Error(
        "MusicEntityDetectionService is required for MUSIC_INFO provider"
      );
    }
    logger10.debug("[MUSIC_INFO Provider] Attempting entity detection");
    const detectedEntities = await entityDetectionService.detectEntities(messageText);
    logger10.debug(
      `[MUSIC_INFO Provider] Detected ${detectedEntities.length} entities: ${detectedEntities.map((e) => `${e.type}:${e.name}`).join(", ")}`
    );
    for (const entity of detectedEntities.slice(0, 3)) {
      logger10.debug(
        `[MUSIC_INFO Provider] Fetching info for ${entity.type}: ${entity.name}`
      );
      if (entity.type === "song") {
        const trackInfo = await musicInfoService.getTrackInfo(entity.name);
        if (trackInfo?.track) {
          musicInfo.push({ type: "track", info: trackInfo.track });
          logger10.debug(
            `[MUSIC_INFO Provider] Successfully fetched track info for: ${entity.name}`
          );
        }
      } else if (entity.type === "artist") {
        const artistInfo = await musicInfoService.getArtistInfo(entity.name);
        if (artistInfo) {
          musicInfo.push({ type: "artist", info: artistInfo });
          logger10.debug(
            `[MUSIC_INFO Provider] Successfully fetched artist info for: ${entity.name}`
          );
        }
      } else if (entity.type === "album") {
        const albumInfo = await musicInfoService.getAlbumInfo(entity.name);
        if (albumInfo) {
          musicInfo.push({ type: "album", info: albumInfo });
          logger10.debug(
            `[MUSIC_INFO Provider] Successfully fetched album info for: ${entity.name}`
          );
        }
      }
    }
    if (musicInfo.length === 0) {
      logger10.debug(
        "[MUSIC_INFO Provider] No music info found, returning empty result"
      );
      return { text: "", data: {}, values: {} };
    }
    logger10.debug(
      `[MUSIC_INFO Provider] Found ${musicInfo.length} music info item(s)`
    );
    const infoTexts = [];
    for (const item of musicInfo) {
      if (item.type === "track" && item.info) {
        const track = item.info;
        const parts = [];
        parts.push(`Track: "${track.title}"`);
        if (track.artist) {
          parts.push(`Artist: ${track.artist}`);
        }
        if (track.album) {
          parts.push(`Album: ${track.album}`);
        }
        if (track.genre && track.genre.length > 0) {
          parts.push(`Genre: ${track.genre.join(", ")}`);
        }
        if (track.year) {
          parts.push(`Year: ${track.year}`);
        }
        if (track.duration) {
          const minutes = Math.floor(track.duration / 60);
          const seconds = track.duration % 60;
          parts.push(
            `Duration: ${minutes}:${seconds.toString().padStart(2, "0")}`
          );
        }
        if (track.description) {
          parts.push(
            `Description: ${track.description.substring(0, 200)}${track.description.length > 200 ? "..." : ""}`
          );
        }
        if (track.lyricsUrl) {
          parts.push(`Lyrics: ${track.lyricsUrl}`);
        }
        infoTexts.push(parts.join("\n"));
      } else if (item.type === "artist" && item.info) {
        const artist = item.info;
        const parts = [];
        parts.push(`Artist: ${artist.name}`);
        if (artist.bio) {
          parts.push(
            `Bio: ${artist.bio.substring(0, 300)}${artist.bio.length > 300 ? "..." : ""}`
          );
        }
        if (artist.genres && artist.genres.length > 0) {
          parts.push(`Genres: ${artist.genres.join(", ")}`);
        }
        if (artist.similarArtists && artist.similarArtists.length > 0) {
          parts.push(
            `Similar artists: ${artist.similarArtists.slice(0, 5).join(", ")}`
          );
        }
        if (artist.topTracks && artist.topTracks.length > 0) {
          parts.push(`Top tracks: ${artist.topTracks.slice(0, 5).join(", ")}`);
        }
        infoTexts.push(parts.join("\n"));
      } else if (item.type === "album" && item.info) {
        const album = item.info;
        const parts = [];
        parts.push(`Album: "${album.title}"`);
        if (album.artist) {
          parts.push(`Artist: ${album.artist}`);
        }
        if (album.year) {
          parts.push(`Year: ${album.year}`);
        }
        if (album.genre && album.genre.length > 0) {
          parts.push(`Genre: ${album.genre.join(", ")}`);
        }
        if (album.tracks && album.tracks.length > 0) {
          parts.push(
            `Tracks: ${album.tracks.slice(0, 10).join(", ")}${album.tracks.length > 10 ? "..." : ""}`
          );
        }
        if (album.description) {
          parts.push(
            `Description: ${album.description.substring(0, 200)}${album.description.length > 200 ? "..." : ""}`
          );
        }
        infoTexts.push(parts.join("\n"));
      }
    }
    const text = infoTexts.length > 0 ? `[MUSIC INFORMATION]
${infoTexts.join("\n\n")}
[/MUSIC INFORMATION]` : "";
    logger10.debug(
      `[MUSIC_INFO Provider] Returning ${text.length} characters of music info text`
    );
    return {
      text,
      data: {
        musicInfo
      },
      values: {
        musicInfoText: text
      }
    };
  }
};

// src/providers/musicLibraryProvider.ts
import {
  logger as logger12
} from "@elizaos/core";

// src/components/musicLibrary.ts
import {
  logger as logger11
} from "@elizaos/core";
var MUSIC_LIBRARY_NAMESPACE = "7f3e5e3e-8f3e-4e3e-8f3e-7f3e5e3e8f3e";
var MUSIC_LIBRARY_TABLE = "music_library";
function getLibraryScopeRoomId(runtime) {
  return runtime.agentId;
}
function isStoredSong(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return typeof candidate.id === "string" && typeof candidate.url === "string" && typeof candidate.title === "string" && typeof candidate.playCount === "number" && typeof candidate.lastPlayed === "number" && typeof candidate.firstAdded === "number" && (candidate.artist === void 0 || typeof candidate.artist === "string") && (candidate.channel === void 0 || typeof candidate.channel === "string") && (candidate.duration === void 0 || typeof candidate.duration === "number") && (candidate.requestedBy === void 0 || Array.isArray(candidate.requestedBy) && candidate.requestedBy.every((entry) => typeof entry === "string"));
}
function getStoredSongFromMemory(memory) {
  return isStoredSong(memory.content.song) ? memory.content.song : null;
}
function getSongIdFromMemory(memory) {
  return typeof memory.content.songId === "string" ? memory.content.songId : null;
}
function generateSongId(url) {
  const normalizedUrl = url.toLowerCase().replace(/^https?:\/\/(www\.)?/, "");
  return v5_default(normalizedUrl, MUSIC_LIBRARY_NAMESPACE);
}
function hydrateSong(stored) {
  return {
    ...stored,
    requestedBy: new Set(stored.requestedBy || [])
  };
}
function dehydrateSong(song) {
  return {
    ...song,
    requestedBy: Array.from(song.requestedBy)
  };
}
async function getSong(runtime, url) {
  const songId = generateSongId(url);
  const memories = await runtime.getMemories({
    tableName: MUSIC_LIBRARY_TABLE,
    roomId: getLibraryScopeRoomId(runtime),
    // Use agentId as global scope
    count: 1e3
    // Get enough to find the song
  });
  const songMemory = memories.find(
    (memory) => getSongIdFromMemory(memory) === songId
  );
  const storedSong = songMemory ? getStoredSongFromMemory(songMemory) : null;
  if (storedSong) {
    return hydrateSong(storedSong);
  }
  return null;
}
async function addSongToLibrary(runtime, songData) {
  const songId = generateSongId(songData.url);
  const now = Date.now();
  let song = await getSong(runtime, songData.url);
  if (song) {
    song.playCount++;
    song.lastPlayed = now;
    if (songData.requestedBy) {
      song.requestedBy.add(songData.requestedBy);
    }
    if (songData.title) song.title = songData.title;
    if (songData.artist) song.artist = songData.artist;
    if (songData.channel) song.channel = songData.channel;
    if (songData.duration) song.duration = songData.duration;
  } else {
    song = {
      id: songId,
      url: songData.url,
      title: songData.title,
      artist: songData.artist,
      channel: songData.channel,
      duration: songData.duration,
      playCount: 1,
      lastPlayed: now,
      firstAdded: now,
      requestedBy: songData.requestedBy ? /* @__PURE__ */ new Set([songData.requestedBy]) : /* @__PURE__ */ new Set()
    };
  }
  const memory = {
    id: v4_default(),
    entityId: runtime.agentId,
    // Global scope
    agentId: runtime.agentId,
    roomId: runtime.agentId,
    // Use agentId as global room
    content: {
      songId,
      song: dehydrateSong(song),
      text: `${song.title} - ${song.artist || song.channel || "Unknown"}`,
      source: "music_library"
    },
    createdAt: now
  };
  await runtime.createMemory(memory, MUSIC_LIBRARY_TABLE);
  logger11.info(
    `[MusicLibrary] Added song to library: "${song.title}" (${song.playCount} plays, ID: ${songId.slice(0, 8)}...)`
  );
  return song;
}
async function getRecentSongs(runtime, limit = 10) {
  try {
    const memories = await runtime.getMemories({
      tableName: MUSIC_LIBRARY_TABLE,
      roomId: getLibraryScopeRoomId(runtime),
      count: 100
      // Get more than we need to sort
    });
    logger11.debug(
      `[MusicLibrary] getRecentSongs: Found ${memories.length} raw memories in ${MUSIC_LIBRARY_TABLE}`
    );
    const songs = memories.map((memory) => getStoredSongFromMemory(memory)).filter((song) => song !== null).map((song) => hydrateSong(song)).sort((a, b) => b.lastPlayed - a.lastPlayed).slice(0, limit);
    logger11.debug(
      `[MusicLibrary] getRecentSongs: Returning ${songs.length} songs`
    );
    return songs;
  } catch (error) {
    logger11.error(
      `[MusicLibrary] Error getting recent songs: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
async function searchLibrary(runtime, query, limit = 10) {
  try {
    const memories = await runtime.getMemories({
      tableName: MUSIC_LIBRARY_TABLE,
      roomId: getLibraryScopeRoomId(runtime),
      count: 500
      // Get a good sample to search through
    });
    const lowerQuery = query.toLowerCase();
    const matches = [];
    for (const memory of memories) {
      const storedSong = getStoredSongFromMemory(memory);
      if (!storedSong) continue;
      const song = hydrateSong(storedSong);
      const titleMatch = song.title.toLowerCase().includes(lowerQuery);
      const artistMatch = song.artist?.toLowerCase().includes(lowerQuery);
      const channelMatch = song.channel?.toLowerCase().includes(lowerQuery);
      if (titleMatch || artistMatch || channelMatch) {
        matches.push(song);
      }
    }
    matches.sort((a, b) => {
      if (a.playCount !== b.playCount) {
        return b.playCount - a.playCount;
      }
      return b.lastPlayed - a.lastPlayed;
    });
    return matches.slice(0, limit);
  } catch (error) {
    logger11.error(
      `Error searching library: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
async function getLastPlayedSong(runtime) {
  const recent = await getRecentSongs(runtime, 1);
  return recent[0] || null;
}
async function getMostPlayedSongs(runtime, limit = 10) {
  try {
    const memories = await runtime.getMemories({
      tableName: MUSIC_LIBRARY_TABLE,
      roomId: getLibraryScopeRoomId(runtime),
      count: 500
    });
    const songs = memories.map((memory) => getStoredSongFromMemory(memory)).filter((song) => song !== null).map((song) => hydrateSong(song)).sort((a, b) => {
      if (a.playCount !== b.playCount) {
        return b.playCount - a.playCount;
      }
      return b.lastPlayed - a.lastPlayed;
    }).slice(0, limit);
    return songs;
  } catch (error) {
    logger11.error(
      `Error getting most played songs: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
async function getLibraryStats(runtime) {
  try {
    const memories = await runtime.getMemories({
      tableName: MUSIC_LIBRARY_TABLE,
      roomId: getLibraryScopeRoomId(runtime),
      count: 1e3
    });
    const songs = memories.map((memory) => getStoredSongFromMemory(memory)).filter((song) => song !== null).map((song) => hydrateSong(song));
    const totalSongs = songs.length;
    const totalPlays = songs.reduce((sum, song) => sum + song.playCount, 0);
    let mostPlayed;
    if (songs.length > 0) {
      mostPlayed = songs.reduce(
        (max, song) => song.playCount > max.playCount ? song : max
      );
    }
    return {
      totalSongs,
      totalPlays,
      mostPlayed
    };
  } catch (error) {
    logger11.error(
      `Error getting library stats: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}

// src/providers/musicLibraryProvider.ts
function isAskingAboutAvailable(messageText) {
  const lower = messageText.toLowerCase();
  const patterns = [
    /what.*(do you|can you).*have/i,
    /what.*available/i,
    /what.*in.*library/i,
    /what.*tracks/i,
    /what.*songs/i,
    /list.*(tracks|songs|music)/i,
    /show.*(tracks|songs|music|library)/i,
    /what.*you.*got/i,
    /what.*can.*play/i,
    /available.*tracks/i,
    /available.*songs/i,
    /your.*library/i,
    /music.*library/i
  ];
  return patterns.some((pattern) => pattern.test(lower));
}
var musicLibraryProvider = {
  name: "MUSIC_LIBRARY",
  get: async (runtime, message, _state) => {
    try {
      const messageText = (message.content?.text || "").trim();
      const isAskingForList = isAskingAboutAvailable(messageText);
      if (isAskingForList) {
        const stats = await getLibraryStats(runtime);
        const mostPlayed = await getMostPlayedSongs(runtime, 20);
        const recentSongs2 = await getRecentSongs(runtime, 10);
        let context2 = "# Music Library - Available Tracks\n\n";
        context2 += "## Library Statistics\n";
        context2 += `- Total tracks in library: ${stats.totalSongs}
`;
        context2 += `- Total plays: ${stats.totalPlays}
`;
        if (stats.mostPlayed) {
          const artist = stats.mostPlayed.artist || stats.mostPlayed.channel || "Unknown Artist";
          context2 += `- Most played: "${stats.mostPlayed.title}" by ${artist} (${stats.mostPlayed.playCount} plays)
`;
        }
        context2 += "\n";
        if (mostPlayed.length > 0) {
          context2 += `## Most Played Tracks (Top ${mostPlayed.length})

`;
          mostPlayed.forEach((song, index) => {
            const artist = song.artist || song.channel || "Unknown Artist";
            context2 += `${index + 1}. "${song.title}" by ${artist}`;
            context2 += ` (${song.playCount} play${song.playCount !== 1 ? "s" : ""})`;
            if (song.duration) {
              const minutes = Math.floor(song.duration / 60);
              const seconds = song.duration % 60;
              context2 += ` - ${minutes}:${seconds.toString().padStart(2, "0")}`;
            }
            context2 += "\n";
          });
          context2 += "\n";
        }
        if (recentSongs2.length > 0) {
          context2 += "## Recently Played Tracks\n\n";
          recentSongs2.forEach((song, index) => {
            const timeAgo = formatTimeAgo(Date.now() - song.lastPlayed);
            const artist = song.artist || song.channel || "Unknown Artist";
            context2 += `${index + 1}. "${song.title}" by ${artist}`;
            if (song.playCount > 1) {
              context2 += ` (played ${song.playCount} times)`;
            }
            context2 += ` - ${timeAgo}
`;
          });
          context2 += "\n";
        }
        if (stats.totalSongs === 0) {
          context2 += "Note: The library is currently empty. Tracks will be added as they are played.\n";
        } else {
          context2 += 'Note: You can ask me to play any of these tracks by name, or say "play it" to refer to the most recent track.\n';
        }
        return { text: context2 };
      }
      const recentSongs = await getRecentSongs(runtime, 5);
      if (recentSongs.length === 0) {
        return { text: "" };
      }
      let context = "# Recently Played Songs\n\n";
      recentSongs.forEach((song, index) => {
        const timeAgo = formatTimeAgo(Date.now() - song.lastPlayed);
        const artist = song.artist || song.channel || "Unknown Artist";
        context += `${index + 1}. "${song.title}" by ${artist}`;
        if (song.playCount > 1) {
          context += ` (played ${song.playCount} times)`;
        }
        context += ` - ${timeAgo}
`;
      });
      context += '\nNote: When the user says "it", "that", "this song", or similar references without specifying a song name, they are likely referring to the most recent song listed above.\n';
      return { text: context };
    } catch (error) {
      logger12.error(
        "Error in music library provider:",
        error instanceof Error ? error.message : String(error)
      );
      return { text: "" };
    }
  }
};
function formatTimeAgo(ms) {
  const seconds = Math.floor(ms / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
var musicLibraryProvider_default = musicLibraryProvider;

// src/providers/wikipediaProvider.ts
import { logger as logger13 } from "@elizaos/core";
var wikipediaProvider = {
  name: "WIKIPEDIA_MUSIC",
  description: "Provides music information extracted from Wikipedia using LLM-based parsing",
  position: 11,
  // After basic music info provider
  get: async (runtime, message, state) => {
    logger13.debug("[WIKIPEDIA_MUSIC Provider] Starting provider execution");
    const messageText = message.content?.text || "";
    if (!messageText || messageText.trim().length === 0) {
      logger13.debug("[WIKIPEDIA_MUSIC Provider] Empty message text");
      return { text: "", data: {}, values: {} };
    }
    logger13.debug(
      `[WIKIPEDIA_MUSIC Provider] Processing message: "${messageText.substring(0, 100)}${messageText.length > 100 ? "..." : ""}"`
    );
    const entityDetectionService = runtime.getService(
      "musicEntityDetection"
    );
    if (!entityDetectionService) {
      logger13.debug(
        "[WIKIPEDIA_MUSIC Provider] MusicEntityDetectionService not available"
      );
      return { text: "", data: {}, values: {} };
    }
    let detectedEntities = [];
    try {
      logger13.debug("[WIKIPEDIA_MUSIC Provider] Attempting entity detection");
      detectedEntities = await entityDetectionService.detectEntities(messageText);
      logger13.debug(
        `[WIKIPEDIA_MUSIC Provider] Detected ${detectedEntities.length} entities: ${detectedEntities.map((e) => `${e.type}:${e.name}`).join(", ")}`
      );
    } catch (error) {
      logger13.warn(
        `[WIKIPEDIA_MUSIC Provider] Entity detection failed: ${error instanceof Error ? error.message : String(error)}`
      );
      return { text: "", data: {}, values: {} };
    }
    if (detectedEntities.length === 0) {
      logger13.debug(
        "[WIKIPEDIA_MUSIC Provider] No entities detected, returning empty result"
      );
      return { text: "", data: {}, values: {} };
    }
    const urlPattern = /^https?:\/\//i;
    const validEntities = detectedEntities.filter((entity) => {
      const isUrl = urlPattern.test(entity.name);
      if (isUrl) {
        logger13.debug(
          `[WIKIPEDIA_MUSIC Provider] Skipping URL entity: ${entity.name}`
        );
      }
      return !isUrl;
    });
    if (validEntities.length === 0) {
      logger13.debug(
        "[WIKIPEDIA_MUSIC Provider] No valid entities after filtering URLs, returning empty result"
      );
      return { text: "", data: {}, values: {} };
    }
    logger13.debug(
      `[WIKIPEDIA_MUSIC Provider] Processing ${validEntities.length} valid entities (filtered ${detectedEntities.length - validEntities.length} URLs)`
    );
    const purpose = determineContext(state, message);
    logger13.debug(`[WIKIPEDIA_MUSIC Provider] Determined context: ${purpose}`);
    const wikipediaExtractionService = runtime.getService(
      "wikipediaExtraction"
    );
    if (!wikipediaExtractionService) {
      logger13.debug(
        "[WIKIPEDIA_MUSIC Provider] WikipediaExtractionService not available"
      );
      return { text: "", data: {}, values: {} };
    }
    const extractedInfo = [];
    for (const entity of validEntities.slice(0, 2)) {
      logger13.debug(
        `[WIKIPEDIA_MUSIC Provider] Extracting Wikipedia info for ${entity.type}: ${entity.name}`
      );
      try {
        const context = {
          purpose,
          currentArtist: entity.type === "artist" ? entity.name : void 0,
          currentTrack: entity.type === "song" ? entity.name : void 0,
          currentAlbum: entity.type === "album" ? entity.name : void 0
        };
        const info = await wikipediaExtractionService.extractFromWikipedia(
          entity.name,
          entity.type,
          context
        );
        if (info) {
          extractedInfo.push({ entity, info });
          logger13.debug(
            `[WIKIPEDIA_MUSIC Provider] Successfully extracted Wikipedia info for ${entity.name}`
          );
        } else {
          logger13.debug(
            `[WIKIPEDIA_MUSIC Provider] No Wikipedia info extracted for ${entity.name}`
          );
        }
      } catch (error) {
        logger13.warn(
          `[WIKIPEDIA_MUSIC Provider] Error extracting Wikipedia info for ${entity.type} "${entity.name}": ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
    if (extractedInfo.length === 0) {
      logger13.debug(
        "[WIKIPEDIA_MUSIC Provider] No Wikipedia info extracted, returning empty result"
      );
      return { text: "", data: {}, values: {} };
    }
    logger13.debug(
      `[WIKIPEDIA_MUSIC Provider] Extracted info for ${extractedInfo.length} entity/entities`
    );
    const contextTexts = [];
    for (const item of extractedInfo) {
      const parts = [];
      parts.push(`${item.entity.type}: ${item.entity.name}`);
      if (item.info.relatedArtists && item.info.relatedArtists.length > 0) {
        parts.push(`Related artists: ${item.info.relatedArtists.join(", ")}`);
      }
      if (item.info.influences && item.info.influences.length > 0) {
        parts.push(`Influences: ${item.info.influences.join(", ")}`);
      }
      if (item.info.genres && item.info.genres.length > 0) {
        parts.push(`Genres: ${item.info.genres.join(", ")}`);
      }
      if (item.info.interestingFacts && item.info.interestingFacts.length > 0) {
        parts.push(`Facts: ${item.info.interestingFacts.join("; ")}`);
      }
      if (item.info.selectionSuggestions && item.info.selectionSuggestions.length > 0) {
        parts.push(`Suggestions: ${item.info.selectionSuggestions.join(", ")}`);
      }
      if (parts.length > 1) {
        contextTexts.push(parts.join("\n"));
      }
    }
    if (contextTexts.length === 0) {
      return { text: "", data: {}, values: {} };
    }
    const text = `[WIKIPEDIA MUSIC CONTEXT]
${contextTexts.join("\n\n")}
[/WIKIPEDIA MUSIC CONTEXT]`;
    logger13.debug(
      `[WIKIPEDIA_MUSIC Provider] Returning ${text.length} characters of Wikipedia context text`
    );
    return {
      text,
      data: {
        wikipediaInfo: extractedInfo
      },
      values: {
        wikipediaText: text
      }
    };
  }
};
function determineContext(_state, message) {
  const messageText = (message.content?.text || "").toLowerCase();
  if (messageText.includes("introduce") || messageText.includes("intro") || messageText.includes("dj")) {
    return "dj_intro";
  }
  if (messageText.includes("select") || messageText.includes("suggest") || messageText.includes("recommend") || messageText.includes("play")) {
    return "music_selection";
  }
  if (messageText.includes("related") || messageText.includes("similar") || messageText.includes("influence")) {
    return "related_artists";
  }
  return "general_info";
}

// src/services/musicEntityDetectionService.ts
import { logger as logger14, ModelType as ModelType2, Service } from "@elizaos/core";
var MUSIC_ENTITY_DETECTION_SERVICE_NAME = "musicEntityDetection";
var MusicEntityDetectionService = class _MusicEntityDetectionService extends Service {
  static serviceType = MUSIC_ENTITY_DETECTION_SERVICE_NAME;
  capabilityDescription = "Detects music entity names (artists, albums, songs) from text using LLM";
  cache = /* @__PURE__ */ new Map();
  CACHE_TTL = 36e5;
  // 1 hour in milliseconds
  static async start(runtime) {
    logger14.debug(
      `Starting MusicEntityDetectionService for agent ${runtime.character.name}`
    );
    return new _MusicEntityDetectionService(runtime);
  }
  async stop() {
    this.clearCache();
  }
  /**
   * Detect music entities from text using LLM
   */
  async detectEntities(text) {
    if (!text || text.trim().length === 0) {
      return [];
    }
    const cacheKey = `detect:${text.substring(0, 200)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.entities;
    }
    if (!this.runtime) {
      throw new Error("MusicEntityDetectionService requires a runtime");
    }
    try {
      const prompt = `Extract music-related entities from the following text. Identify artists, albums, and songs.

Text: "${text}"

Return a JSON array of detected entities. Each entity should have:
- type: "artist", "album", or "song"
- name: the entity name (exact as mentioned)
- confidence: a number between 0 and 1 indicating confidence
- context: a brief snippet of surrounding text (optional)

IMPORTANT RULES:
- Do NOT include URLs (like YouTube links, Spotify links, etc.) as entities
- Only extract actual artist names, album titles, or song titles
- URLs should be completely ignored

Example format:
[
  {"type": "artist", "name": "The Beatles", "confidence": 0.9, "context": "mentioned in conversation"},
  {"type": "song", "name": "Bohemian Rhapsody", "confidence": 0.8}
]

If no music entities are found, return an empty array: [].

IMPORTANT: Only return valid JSON. Do not include any explanation or text outside the JSON array.`;
      const response = await this.runtime.useModel(ModelType2.TEXT_SMALL, {
        prompt,
        maxTokens: 500
      });
      let entities = [];
      try {
        const cleaned = String(response).trim();
        let parsedEntities = [];
        const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedEntities = JSON.parse(jsonMatch[0]);
        } else {
          parsedEntities = JSON.parse(cleaned);
        }
        const urlPattern = /^https?:\/\//i;
        entities = parsedEntities.filter((e) => {
          if (!e || typeof e !== "object") return false;
          if (typeof e.type !== "string" || !["artist", "album", "song"].includes(e.type)) {
            return false;
          }
          if (typeof e.name !== "string" || e.name.trim().length === 0)
            return false;
          if (typeof e.confidence !== "number" || e.confidence < 0 || e.confidence > 1)
            return false;
          if (urlPattern.test(e.name)) {
            return false;
          }
          return true;
        }).map((e) => {
          const context = typeof e.context === "string" ? e.context.trim() : void 0;
          return {
            type: e.type,
            name: e.name.trim(),
            confidence: e.confidence,
            context
          };
        }).filter((e) => e.confidence > 0.3);
      } catch (parseError) {
        throw new Error(
          `Failed to parse music entity detection response: ${parseError instanceof Error ? parseError.message : String(parseError)}`
        );
      }
      this.cache.set(cacheKey, {
        entities,
        timestamp: Date.now()
      });
      return entities;
    } catch (error) {
      logger14.error(`Error detecting music entities: ${error}`);
      throw error;
    }
  }
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
};

// src/services/musicInfoService.ts
import { logger as logger19, Service as Service2 } from "@elizaos/core";

// src/services/geniusClient.ts
import { logger as logger15 } from "@elizaos/core";

// src/utils/retry.ts
var DEFAULT_OPTIONS = {
  maxRetries: 3,
  initialDelay: 1e3,
  // 1 second
  maxDelay: 3e4,
  // 30 seconds
  backoffMultiplier: 2,
  retryableErrors: (error) => {
    const status = error.response?.status;
    if (error?.code === "ECONNRESET" || error?.code === "ETIMEDOUT" || error?.code === "ENOTFOUND") {
      return true;
    }
    if (typeof status === "number" && status >= 500 && status < 600) {
      return true;
    }
    if (status === 429) {
      return true;
    }
    return false;
  }
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function calculateDelay(attempt, options) {
  const delay = options.initialDelay * options.backoffMultiplier ** attempt;
  return Math.min(delay, options.maxDelay);
}
async function retryWithBackoff(fn, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError;
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const retryableError = error;
      lastError = error;
      if (attempt >= opts.maxRetries) {
        break;
      }
      if (!opts.retryableErrors(retryableError)) {
        break;
      }
      const delay = calculateDelay(attempt, opts);
      if (retryableError.response?.status === 429) {
        const headers = retryableError.response.headers;
        const retryAfter = headers instanceof Headers ? headers.get("retry-after") || void 0 : headers?.["retry-after"];
        if (retryAfter) {
          const retryAfterMs = parseInt(retryAfter, 10) * 1e3;
          await sleep(Math.max(retryAfterMs, delay));
          continue;
        }
      }
      await sleep(delay);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError ?? "Retry attempts exhausted"));
}

// src/services/geniusClient.ts
function buildGeniusHttpError(response) {
  const error = new Error(
    `Genius API error: ${response.status} ${response.statusText}`
  );
  error.response = {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  };
  return error;
}
var GeniusClient = class {
  baseUrl = "https://api.genius.com";
  apiKey;
  lastRequestTime = 0;
  minRequestInterval = 200;
  // 200ms = 5 requests per second (conservative)
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Genius API key is required");
    }
    this.apiKey = apiKey;
  }
  /**
   * Rate limit: ensure we don't exceed rate limits
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(
        (resolve) => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }
  /**
   * Search for a song
   */
  async searchSong(query) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "User-Agent": "ElizaOS-MusicInfo/1.0.0",
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          logger15.warn("Genius API: Invalid API key");
          return null;
        }
        throw buildGeniusHttpError(response);
      }
      const data = await response.json();
      if (!data.response?.hits) {
        return null;
      }
      return data.response.hits.map((hit) => ({
        id: hit.result.id,
        title: hit.result.title,
        artist: hit.result.primary_artist.name,
        url: hit.result.url
      })).slice(0, 5);
    }).catch((error) => {
      logger15.error(`Error searching Genius after retries: ${error}`);
      return null;
    });
  }
  /**
   * Get lyrics for a song by ID
   * Note: Genius API doesn't directly provide lyrics, but we can get the URL
   * For actual lyrics, we'd need to scrape the page (which requires separate implementation)
   */
  async getSongInfo(songId) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const url = `${this.baseUrl}/songs/${songId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "User-Agent": "ElizaOS-MusicInfo/1.0.0",
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw buildGeniusHttpError(response);
      }
      const data = await response.json();
      if (!data.response?.song) {
        return null;
      }
      const song = data.response.song;
      return {
        title: song.title,
        artist: song.primary_artist.name,
        url: song.url,
        lyricsUrl: song.url
        // Genius URLs point to lyrics pages
      };
    }).catch((error) => {
      logger15.error(`Error getting Genius song info after retries: ${error}`);
      return null;
    });
  }
  /**
   * Get lyrics for a track (searches first, then gets song info)
   */
  async getLyrics(trackName, artistName) {
    try {
      const query = artistName ? `${trackName} ${artistName}` : trackName;
      const searchResults = await this.searchSong(query);
      if (!searchResults || searchResults.length === 0) {
        return null;
      }
      let songId = null;
      const trackLower = trackName.toLowerCase();
      const artistLower = artistName?.toLowerCase();
      for (const result of searchResults) {
        if (result.title.toLowerCase().includes(trackLower)) {
          if (!artistLower || result.artist.toLowerCase().includes(artistLower)) {
            songId = result.id;
            break;
          }
        }
      }
      if (!songId && searchResults.length > 0) {
        songId = searchResults[0].id;
      }
      if (!songId) {
        return null;
      }
      const songInfo = await this.getSongInfo(songId);
      if (!songInfo) {
        return null;
      }
      return songInfo.lyricsUrl;
    } catch (error) {
      logger15.error(`Error getting lyrics from Genius: ${error}`);
      return null;
    }
  }
  /**
   * Validate API key by making a test request
   */
  async validateApiKey() {
    return retryWithBackoff(
      async () => {
        await this.rateLimit();
        const url = `${this.baseUrl}/account`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "User-Agent": "ElizaOS-MusicInfo/1.0.0",
            Accept: "application/json"
          }
        });
        return response.ok;
      },
      {
        maxRetries: 2,
        // Fewer retries for validation
        retryableErrors: (error) => {
          const status = error.response?.status;
          return error?.code === "ECONNRESET" || error?.code === "ETIMEDOUT" || error?.code === "ENOTFOUND" || typeof status === "number" && status >= 500 && status < 600;
        }
      }
    ).catch(() => false);
  }
};

// src/services/lastFmClient.ts
import { logger as logger16 } from "@elizaos/core";
function buildLastFmHttpError(response) {
  const error = new Error(
    `Last.fm API error: ${response.status} ${response.statusText}`
  );
  error.response = {
    status: response.status,
    headers: response.headers
  };
  return error;
}
var LastFmClient = class {
  baseUrl = "https://ws.audioscrobbler.com/2.0";
  apiKey;
  lastRequestTime = 0;
  minRequestInterval = 200;
  // 200ms = 5 requests per second
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Last.fm API key is required");
    }
    this.apiKey = apiKey;
  }
  /**
   * Rate limit: ensure we don't exceed 5 requests per second
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(
        (resolve) => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }
  /**
   * Get track information
   */
  async getTrackInfo(trackName, artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const params = new URLSearchParams({
        method: "track.getInfo",
        api_key: this.apiKey,
        track: trackName,
        artist: artistName,
        format: "json"
      });
      const url = `${this.baseUrl}/?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw buildLastFmHttpError(response);
      }
      const data = await response.json();
      if (data.error) {
        logger16.debug(`Last.fm error: ${data.message}`);
        return null;
      }
      const track = data.track;
      if (!track) {
        return null;
      }
      const trackInfo = {
        title: track.name,
        artist: track.artist?.name || artistName,
        album: track.album?.title,
        duration: track.duration ? Math.floor(parseInt(track.duration, 10) / 1e3) : void 0,
        tags: track.toptags?.tag?.map((tag) => tag.name) || [],
        url: track.url,
        description: track.wiki?.content ? track.wiki.content.substring(0, 500).replace(/<[^>]*>/g, "") : void 0
      };
      return trackInfo;
    }).catch((error) => {
      logger16.error(`Error fetching Last.fm track info after retries: ${error}`);
      return null;
    });
  }
  /**
   * Get artist information
   */
  async getArtistInfo(artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const params = new URLSearchParams({
        method: "artist.getInfo",
        api_key: this.apiKey,
        artist: artistName,
        format: "json"
      });
      const url = `${this.baseUrl}/?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw buildLastFmHttpError(response);
      }
      const data = await response.json();
      if (data.error || !data.artist) {
        return null;
      }
      const artist = data.artist;
      const artistInfo = {
        name: artist.name,
        genres: artist.tags?.tag?.map((tag) => tag.name) || [],
        bio: artist.bio?.content ? artist.bio.content.substring(0, 1e3).replace(/<[^>]*>/g, "") : void 0,
        image: artist.image?.find((img) => img.size === "large")?.["#text"],
        similarArtists: artist.similar?.artist?.map((a) => a.name) || [],
        topTracks: artist.toptracks?.track?.map((track) => track.name) || [],
        albums: artist.albums?.album?.map((album) => album.name) || []
      };
      return artistInfo;
    }).catch((error) => {
      logger16.error(
        `Error fetching Last.fm artist info after retries: ${error}`
      );
      return null;
    });
  }
  /**
   * Get album information
   */
  async getAlbumInfo(albumName, artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const params = new URLSearchParams({
        method: "album.getInfo",
        api_key: this.apiKey,
        album: albumName,
        artist: artistName,
        format: "json"
      });
      const url = `${this.baseUrl}/?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw buildLastFmHttpError(response);
      }
      const data = await response.json();
      if (data.error || !data.album) {
        return null;
      }
      const album = data.album;
      const albumInfo = {
        title: album.name,
        artist: album.artist || artistName,
        year: album.wiki?.published ? parseInt(album.wiki.published.substring(0, 4), 10) : void 0,
        genre: album.tags?.tag?.map((tag) => tag.name) || [],
        tracks: album.tracks?.track?.map((track) => track.name) || [],
        coverArt: album.image?.find((img) => img.size === "large")?.["#text"],
        description: album.wiki?.content ? album.wiki.content.substring(0, 500).replace(/<[^>]*>/g, "") : void 0
      };
      return albumInfo;
    }).catch((error) => {
      logger16.error(`Error fetching Last.fm album info after retries: ${error}`);
      return null;
    });
  }
};

// src/services/musicBrainzClient.ts
import { logger as logger17 } from "@elizaos/core";
function buildMusicBrainzHttpError(response) {
  const error = new Error(
    `MusicBrainz API error: ${response.status} ${response.statusText}`
  );
  error.response = {
    status: response.status,
    statusText: response.statusText
  };
  return error;
}
var MusicBrainzClient = class {
  baseUrl = "https://musicbrainz.org/ws/2";
  userAgent;
  lastRequestTime = 0;
  minRequestInterval = 1e3;
  // 1 second
  constructor(userAgent = "ElizaOS-MusicInfo/1.0.0 (https://github.com/elizaos/eliza)") {
    this.userAgent = userAgent;
  }
  /**
   * Rate limit: ensure we wait at least 1 second between requests
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(
        (resolve) => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }
  /**
   * Search for a recording (track) by title and artist
   */
  async searchRecording(title, artist) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      let query = `recording:"${title}"`;
      if (artist) {
        query += ` AND artist:"${artist}"`;
      }
      const url = `${this.baseUrl}/recording?query=${encodeURIComponent(query)}&fmt=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw buildMusicBrainzHttpError(response);
      }
      const data = await response.json();
      if (!data.recordings || data.recordings.length === 0) {
        return null;
      }
      const recording = data.recordings[0];
      const trackInfo = {
        title: recording.title,
        artist: recording["artist-credit"]?.[0]?.name || artist || "Unknown Artist",
        duration: recording.length ? Math.floor(recording.length / 1e3) : void 0,
        // Convert ms to seconds
        tags: recording.tags?.map((tag) => tag.name) || []
      };
      if (recording.releases && recording.releases.length > 0) {
        const release = recording.releases[0];
        trackInfo.album = release.title;
        if (release.date) {
          trackInfo.year = parseInt(release.date.substring(0, 4), 10);
        }
      }
      return trackInfo;
    }).catch((error) => {
      logger17.error(
        `Error fetching MusicBrainz recording after retries: ${error}`
      );
      throw error;
    });
  }
  /**
   * Get artist information by name
   */
  async getArtist(artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const url = `${this.baseUrl}/artist?query=artist:"${encodeURIComponent(artistName)}"&fmt=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw buildMusicBrainzHttpError(response);
      }
      const data = await response.json();
      if (!data.artists || data.artists.length === 0) {
        return null;
      }
      const artist = data.artists[0];
      const artistInfo = {
        name: artist.name,
        genres: artist.tags?.map((tag) => tag.name) || []
      };
      if (artist.aliases && artist.aliases.length > 0) {
        artistInfo.similarArtists = artist.aliases.map((alias) => alias.name);
      }
      return artistInfo;
    }).catch((error) => {
      logger17.error(`Error fetching MusicBrainz artist after retries: ${error}`);
      throw error;
    });
  }
  /**
   * Get release (album) information
   */
  async getRelease(albumTitle, artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      let query = `release:"${albumTitle}"`;
      if (artistName) {
        query += ` AND artist:"${artistName}"`;
      }
      const url = `${this.baseUrl}/release?query=${encodeURIComponent(query)}&fmt=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw buildMusicBrainzHttpError(response);
      }
      const data = await response.json();
      if (!data.releases || data.releases.length === 0) {
        return null;
      }
      const release = data.releases[0];
      const albumInfo = {
        title: release.title,
        artist: release["artist-credit"]?.[0]?.name || artistName || "Unknown Artist",
        genre: release.tags?.map((tag) => tag.name) || []
      };
      if (release.date) {
        albumInfo.year = parseInt(release.date.substring(0, 4), 10);
      }
      return albumInfo;
    }).catch((error) => {
      logger17.error(
        `Error fetching MusicBrainz release after retries: ${error}`
      );
      throw error;
    });
  }
};

// src/services/theAudioDbClient.ts
import { logger as logger18 } from "@elizaos/core";
function buildTheAudioDbHttpError(response) {
  const error = new Error(
    `TheAudioDB API error: ${response.status} ${response.statusText}`
  );
  error.response = {
    status: response.status,
    headers: response.headers
  };
  return error;
}
var TheAudioDbClient = class {
  baseUrl = "https://theaudiodb.com/api/v1/json";
  apiKey;
  lastRequestTime = 0;
  minRequestInterval = 100;
  // 100ms = 10 requests per second (conservative)
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("TheAudioDB API key is required");
    }
    this.apiKey = apiKey;
  }
  /**
   * Rate limit: ensure we don't exceed rate limits
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(
        (resolve) => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }
  /**
   * Search for an artist
   */
  async searchArtist(artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const url = `${this.baseUrl}/${this.apiKey}/search.php?s=${encodeURIComponent(artistName)}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw buildTheAudioDbHttpError(response);
      }
      const data = await response.json();
      if (!data.artists || data.artists.length === 0) {
        return null;
      }
      return data.artists;
    }).catch((error) => {
      logger18.error(`Error searching TheAudioDB artist after retries: ${error}`);
      return null;
    });
  }
  /**
   * Get artist information including high-quality images
   */
  async getArtistInfo(artistName) {
    try {
      const artists = await this.searchArtist(artistName);
      if (!artists || artists.length === 0) {
        return null;
      }
      const artist = artists[0];
      await this.rateLimit();
      const detailUrl = `${this.baseUrl}/${this.apiKey}/artist.php?i=${artist.idArtist}`;
      const detailData = await retryWithBackoff(async () => {
        const detailResponse = await fetch(detailUrl, {
          headers: {
            Accept: "application/json"
          }
        });
        if (!detailResponse.ok) {
          throw buildTheAudioDbHttpError(detailResponse);
        }
        return await detailResponse.json();
      });
      if (!detailData?.artists || detailData.artists.length === 0) {
        return null;
      }
      const detailArtist = detailData.artists[0];
      return {
        strArtist: detailArtist.strArtist || artist.strArtist,
        strArtistThumb: detailArtist.strArtistThumb || artist.strArtistThumb,
        strArtistLogo: detailArtist.strArtistLogo || artist.strArtistLogo,
        strArtistFanart: detailArtist.strArtistFanart || artist.strArtistFanart,
        strArtistBanner: detailArtist.strArtistBanner || artist.strArtistBanner,
        strBiographyEN: detailArtist.strBiographyEN,
        intFormedYear: detailArtist.intFormedYear,
        strGenre: detailArtist.strGenre,
        strCountry: detailArtist.strCountry
      };
    } catch (error) {
      logger18.error(`Error getting TheAudioDB artist info: ${error}`);
      return null;
    }
  }
  /**
   * Search for an album
   */
  async searchAlbum(albumName, artistName) {
    await this.rateLimit();
    return retryWithBackoff(async () => {
      let url;
      if (artistName) {
        url = `${this.baseUrl}/${this.apiKey}/searchalbum.php?s=${encodeURIComponent(artistName)}&a=${encodeURIComponent(albumName)}`;
      } else {
        url = `${this.baseUrl}/${this.apiKey}/searchalbum.php?a=${encodeURIComponent(albumName)}`;
      }
      const response = await fetch(url, {
        headers: {
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw buildTheAudioDbHttpError(response);
      }
      const data = await response.json();
      if (!data.album || data.album.length === 0) {
        return null;
      }
      return data.album;
    }).catch((error) => {
      logger18.error(`Error searching TheAudioDB album after retries: ${error}`);
      return null;
    });
  }
  /**
   * Get album information including high-quality artwork
   */
  async getAlbumInfo(albumName, artistName) {
    try {
      const albums = await this.searchAlbum(albumName, artistName);
      if (!albums || albums.length === 0) {
        return null;
      }
      const album = albums[0];
      await this.rateLimit();
      const detailUrl = `${this.baseUrl}/${this.apiKey}/album.php?m=${album.idAlbum}`;
      const detailData = await retryWithBackoff(async () => {
        const detailResponse = await fetch(detailUrl, {
          headers: {
            Accept: "application/json"
          }
        });
        if (!detailResponse.ok) {
          throw buildTheAudioDbHttpError(detailResponse);
        }
        return await detailResponse.json();
      });
      if (!detailData?.album || detailData.album.length === 0) {
        return null;
      }
      const detailAlbum = detailData.album[0];
      return {
        strAlbum: detailAlbum.strAlbum || album.strAlbum,
        strArtist: detailAlbum.strArtist || album.strArtist,
        strAlbumThumb: detailAlbum.strAlbumThumb || album.strAlbumThumb,
        strAlbumCDart: detailAlbum.strAlbumCDart || album.strAlbumCDart,
        intYearReleased: detailAlbum.intYearReleased,
        strGenre: detailAlbum.strGenre,
        strDescriptionEN: detailAlbum.strDescriptionEN
      };
    } catch (error) {
      logger18.error(`Error getting TheAudioDB album info: ${error}`);
      return null;
    }
  }
  /**
   * Validate API key by making a test request
   */
  async validateApiKey() {
    return retryWithBackoff(
      async () => {
        await this.rateLimit();
        const url = `${this.baseUrl}/${this.apiKey}/search.php?s=The Beatles`;
        const response = await fetch(url, {
          headers: {
            Accept: "application/json"
          }
        });
        return response.ok;
      },
      {
        maxRetries: 2,
        // Fewer retries for validation
        retryableErrors: (error) => {
          const status = error.response?.status;
          return error?.code === "ECONNRESET" || error?.code === "ETIMEDOUT" || error?.code === "ENOTFOUND" || typeof status === "number" && status >= 500 && status < 600;
        }
      }
    ).catch(() => false);
  }
};

// src/services/musicInfoService.ts
var MUSIC_INFO_SERVICE_NAME = "musicInfo";
var MusicInfoService = class _MusicInfoService extends Service2 {
  static serviceType = MUSIC_INFO_SERVICE_NAME;
  capabilityDescription = "Fetches music metadata (tracks, artists, albums) from authoritative sources";
  cache = /* @__PURE__ */ new Map();
  CACHE_TTL = 36e5;
  // 1 hour in milliseconds
  musicBrainzClient = null;
  lastFmClient = null;
  geniusClient = null;
  theAudioDbClient = null;
  serviceStatus = {
    musicBrainz: { status: "not_configured", lastChecked: 0 },
    lastFm: { status: "not_configured", lastChecked: 0 },
    genius: { status: "not_configured", lastChecked: 0 },
    theAudioDb: { status: "not_configured", lastChecked: 0 },
    wikipedia: { status: "not_configured", lastChecked: 0 }
  };
  constructor(runtime) {
    super(runtime);
    const userAgent = runtime?.getSetting("MUSICBRAINZ_USER_AGENT") || "ElizaOS-MusicInfo/1.0.0 (https://github.com/elizaos/eliza)";
    this.musicBrainzClient = new MusicBrainzClient(userAgent);
    this.serviceStatus.musicBrainz = {
      status: "active",
      lastChecked: Date.now()
    };
    const lastFmApiKey = runtime?.getSetting("LASTFM_API_KEY");
    if (lastFmApiKey) {
      try {
        this.lastFmClient = new LastFmClient(lastFmApiKey);
        this.serviceStatus.lastFm = {
          status: "active",
          lastChecked: Date.now()
        };
      } catch (error) {
        logger19.warn(`Last.fm client not initialized: ${error}`);
        this.serviceStatus.lastFm = {
          status: "unavailable",
          lastChecked: Date.now(),
          lastError: String(error)
        };
      }
    }
    const geniusApiKey = runtime?.getSetting("GENIUS_API_KEY");
    if (geniusApiKey) {
      try {
        this.geniusClient = new GeniusClient(geniusApiKey);
        this.serviceStatus.genius = {
          status: "active",
          lastChecked: Date.now()
        };
      } catch (error) {
        logger19.warn(`Genius client not initialized: ${error}`);
        this.serviceStatus.genius = {
          status: "unavailable",
          lastChecked: Date.now(),
          lastError: String(error)
        };
      }
    }
    const theAudioDbApiKey = runtime?.getSetting(
      "THEAUDIODB_API_KEY"
    );
    if (theAudioDbApiKey) {
      try {
        this.theAudioDbClient = new TheAudioDbClient(theAudioDbApiKey);
        this.serviceStatus.theAudioDb = {
          status: "active",
          lastChecked: Date.now()
        };
      } catch (error) {
        logger19.warn(`TheAudioDB client not initialized: ${error}`);
        this.serviceStatus.theAudioDb = {
          status: "unavailable",
          lastChecked: Date.now(),
          lastError: String(error)
        };
      }
    }
    const wikipediaService = runtime?.getService(
      "wikipedia"
    );
    if (wikipediaService) {
      this.serviceStatus.wikipedia = {
        status: "active",
        lastChecked: Date.now()
      };
    }
    this.validateApiKeys().catch((error) => {
      logger19.debug(`API key validation completed with some issues: ${error}`);
    });
  }
  static async start(runtime) {
    logger19.debug(
      `Starting MusicInfoService for agent ${runtime.character.name}`
    );
    return new _MusicInfoService(runtime);
  }
  async stop() {
    this.clearCache();
  }
  /**
   * Get service status for all integrated APIs
   */
  getServiceStatus() {
    return { ...this.serviceStatus };
  }
  /**
   * Validate API keys for all configured services
   * Updates service status based on validation results
   */
  async validateApiKeys() {
    if (this.lastFmClient) {
      try {
        const startTime = Date.now();
        const testResult = await this.lastFmClient.getArtistInfo("The Beatles");
        const responseTime = Date.now() - startTime;
        if (testResult) {
          this.serviceStatus.lastFm = {
            status: "active",
            lastChecked: Date.now(),
            responseTime
          };
        } else {
          this.serviceStatus.lastFm = {
            status: "degraded",
            lastChecked: Date.now(),
            responseTime,
            lastError: "API returned no results"
          };
        }
      } catch (error) {
        this.serviceStatus.lastFm = {
          status: "unavailable",
          lastChecked: Date.now(),
          lastError: String(error)
        };
        logger19.warn(`Last.fm API validation failed: ${error}`);
      }
    }
    if (this.geniusClient) {
      try {
        const startTime = Date.now();
        const isValid = await this.geniusClient.validateApiKey();
        const responseTime = Date.now() - startTime;
        this.serviceStatus.genius = {
          status: isValid ? "active" : "unavailable",
          lastChecked: Date.now(),
          responseTime,
          lastError: isValid ? void 0 : "Invalid API key"
        };
        if (!isValid) {
          logger19.warn("Genius API key validation failed");
        }
      } catch (error) {
        this.serviceStatus.genius = {
          status: "unavailable",
          lastChecked: Date.now(),
          lastError: String(error)
        };
        logger19.warn(`Genius API validation failed: ${error}`);
      }
    }
    if (this.theAudioDbClient) {
      try {
        const startTime = Date.now();
        const isValid = await this.theAudioDbClient.validateApiKey();
        const responseTime = Date.now() - startTime;
        this.serviceStatus.theAudioDb = {
          status: isValid ? "active" : "unavailable",
          lastChecked: Date.now(),
          responseTime,
          lastError: isValid ? void 0 : "Invalid API key"
        };
        if (!isValid) {
          logger19.warn("TheAudioDB API key validation failed");
        }
      } catch (error) {
        this.serviceStatus.theAudioDb = {
          status: "unavailable",
          lastChecked: Date.now(),
          lastError: String(error)
        };
        logger19.warn(`TheAudioDB API validation failed: ${error}`);
      }
    }
    if (this.musicBrainzClient) {
      try {
        const startTime = Date.now();
        await this.musicBrainzClient.searchRecording("Test", "Test");
        const responseTime = Date.now() - startTime;
        this.serviceStatus.musicBrainz = {
          status: "active",
          lastChecked: Date.now(),
          responseTime
        };
      } catch (error) {
        this.serviceStatus.musicBrainz = {
          status: "degraded",
          lastChecked: Date.now(),
          lastError: String(error)
        };
        logger19.warn(`MusicBrainz connectivity check failed: ${error}`);
      }
    }
    const wikipediaService = this.runtime?.getService(
      "wikipedia"
    );
    if (wikipediaService) {
      try {
        const startTime = Date.now();
        const testResult = await wikipediaService.getArtistInfo("The Beatles");
        const responseTime = Date.now() - startTime;
        this.serviceStatus.wikipedia = {
          status: testResult ? "active" : "degraded",
          lastChecked: Date.now(),
          responseTime
        };
      } catch (error) {
        this.serviceStatus.wikipedia = {
          status: "degraded",
          lastChecked: Date.now(),
          lastError: String(error)
        };
        logger19.warn(`Wikipedia service check failed: ${error}`);
      }
    }
  }
  /**
   * Extract track information from a YouTube URL or MusicBrainz lookup.
   */
  async getTrackInfo(urlOrTitle) {
    const cacheKey = `track:${urlOrTitle}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    try {
      if (this.isYouTubeUrl(urlOrTitle)) {
        const info = await this.getInfoFromYouTube(urlOrTitle);
        if (info?.track) {
          const result2 = {
            track: info.track,
            source: info.source
          };
          this.cache.set(cacheKey, { data: result2, timestamp: Date.now() });
          return result2;
        }
        return null;
      }
      const parsed = this.parseTitle(urlOrTitle);
      if (!parsed.title) {
        throw new Error(`Track title is required for lookup: ${urlOrTitle}`);
      }
      if (!this.musicBrainzClient) {
        throw new Error("MusicBrainz client is unavailable");
      }
      const mbTrack = await this.musicBrainzClient.searchRecording(
        parsed.title,
        parsed.artist
      );
      if (!mbTrack) {
        return null;
      }
      const result = {
        track: mbTrack,
        source: "musicbrainz"
      };
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      logger19.error(`Error fetching track info for ${urlOrTitle}: ${error}`);
      throw error;
    }
  }
  /**
   * Parse title string to extract artist and track name
   */
  parseTitle(title) {
    const patterns = [
      /^(.+?)\s*-\s*(.+)$/,
      // "Artist - Title"
      /^(.+?)\s+by\s+(.+)$/i
      // "Title by Artist"
    ];
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        const [, part1, part2] = match;
        if (pattern.source.includes("by")) {
          return { title: part1.trim(), artist: part2.trim() };
        } else {
          return { title: part2.trim(), artist: part1.trim() };
        }
      }
    }
    return { title: title.trim() };
  }
  /**
   * Get artist information from MusicBrainz.
   */
  async getArtistInfo(artistName) {
    const cacheKey = `artist:${artistName}`;
    const cached = this.cache.get(cacheKey);
    if (cached?.data.artist) {
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data.artist;
      }
    }
    try {
      if (!this.musicBrainzClient) {
        throw new Error("MusicBrainz client is unavailable");
      }
      const mbArtist = await this.musicBrainzClient.getArtist(artistName);
      if (!mbArtist) {
        return null;
      }
      this.cache.set(cacheKey, {
        data: { artist: mbArtist, source: "musicbrainz" },
        timestamp: Date.now()
      });
      return mbArtist;
    } catch (error) {
      logger19.error(`Error fetching artist info for ${artistName}: ${error}`);
      throw error;
    }
  }
  /**
   * Get album information from MusicBrainz.
   */
  async getAlbumInfo(albumTitle, artistName) {
    const cacheKey = `album:${albumTitle}:${artistName || ""}`;
    const cached = this.cache.get(cacheKey);
    if (cached?.data.album) {
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data.album;
      }
    }
    try {
      if (!this.musicBrainzClient) {
        throw new Error("MusicBrainz client is unavailable");
      }
      const mbAlbum = await this.musicBrainzClient.getRelease(
        albumTitle,
        artistName
      );
      if (!mbAlbum) {
        return null;
      }
      this.cache.set(cacheKey, {
        data: { album: mbAlbum, source: "musicbrainz" },
        timestamp: Date.now()
      });
      return mbAlbum;
    } catch (error) {
      logger19.error(`Error fetching album info for ${albumTitle}: ${error}`);
      throw error;
    }
  }
  /**
   * Check if a string is a YouTube URL
   */
  isYouTubeUrl(str) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(str);
  }
  /**
   * Extract information from YouTube URL using play-dl
   */
  async getInfoFromYouTube(url) {
    try {
      const play = await import("@vookav2/play-dl").then((m) => m.default || m);
      const videoInfo = await play.video_info(url);
      const trackInfo = {
        title: videoInfo.video_details.title || "Unknown Title",
        artist: videoInfo.video_details.channel?.name || "Unknown Artist",
        duration: videoInfo.video_details.durationInSec || void 0,
        url,
        thumbnail: videoInfo.video_details.thumbnails?.[0]?.url || void 0,
        description: videoInfo.video_details.description || void 0
      };
      return {
        track: trackInfo,
        source: "youtube"
      };
    } catch (error) {
      logger19.error(`Error extracting YouTube info: ${error}`);
      throw error;
    }
  }
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
  /**
   * Pre-warm cache for a track (non-blocking)
   * This is called by plugin-dj to prepare caches before tracks are played
   * @param urlOrTitle - YouTube URL or track title
   */
  async prewarmTrackInfo(urlOrTitle) {
    const cacheKey = `track:${urlOrTitle}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return;
    }
    this.getTrackInfo(urlOrTitle).catch((error) => {
      logger19.debug(`Failed to pre-warm track info for ${urlOrTitle}: ${error}`);
    });
  }
  /**
   * Pre-warm cache for multiple tracks (non-blocking)
   * @param tracks - Array of YouTube URLs or track titles
   */
  async prewarmTracks(tracks) {
    const promises = tracks.map((track) => this.prewarmTrackInfo(track));
    await Promise.allSettled(promises);
  }
};

// src/services/musicLibraryService.ts
import { logger as logger24, Service as Service3 } from "@elizaos/core";

// src/components/analytics.ts
import {
  createUniqueUuid as createUniqueUuid2,
  logger as logger20
} from "@elizaos/core";
var ANALYTICS_COMPONENT_TYPE = "dj_analytics";
var ANALYTICS_ENTITY_PREFIX = "dj-analytics";
function createEmptyAnalytics() {
  return {
    totalTracksPlayed: 0,
    totalPlayTime: 0,
    mostPlayedTracks: [],
    mostRequestedBy: [],
    popularTimes: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      playCount: 0
    })),
    popularDays: Array.from({ length: 7 }, (_, i) => ({
      day: i,
      playCount: 0
    })),
    milestones: [],
    sessionStats: {
      totalSessions: 0,
      averageSessionDuration: 0,
      longestSession: 0
    }
  };
}
function getAnalyticsEntityId(runtime, roomId) {
  return createUniqueUuid2(runtime, `${ANALYTICS_ENTITY_PREFIX}-${roomId}`);
}
async function ensureAnalyticsEntity(runtime, roomId) {
  const roomContext = await requireRoomContext(runtime, roomId, "DJ Analytics");
  const room = roomContext.room;
  const effectiveRoomId = roomContext.roomId;
  const effectiveWorldId = roomContext.worldId;
  const entityId = getAnalyticsEntityId(runtime, roomId);
  let entity = await runtime.getEntityById(entityId);
  if (!entity) {
    const created = await runtime.createEntity({
      id: entityId,
      names: [
        room?.name ? `DJ Analytics (${room.name})` : `DJ Analytics (${roomId.slice(0, 8)})`
      ],
      metadata: {
        dj: {
          type: "analytics",
          roomId,
          roomName: room?.name,
          serverId: room?.serverId
        }
      },
      agentId: runtime.agentId
    });
    if (!created) {
      entity = await runtime.getEntityById(entityId);
      if (!entity) {
        logger20.error(
          `[DJ Analytics] Failed to ensure analytics entity exists for room ${roomId}`
        );
        throw new Error(
          `[DJ Analytics] Failed to ensure analytics entity exists for room ${roomId}`
        );
      }
    }
  }
  return { entityId, room, effectiveRoomId, effectiveWorldId };
}
async function getAnalytics(runtime, roomId) {
  const entityId = getAnalyticsEntityId(runtime, roomId);
  let component = await runtime.getComponent(
    entityId,
    ANALYTICS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    component = await runtime.getComponent(
      roomId,
      ANALYTICS_COMPONENT_TYPE,
      void 0,
      runtime.agentId
    );
  }
  return getStoredField(component, "analytics");
}
async function initializeAnalytics(runtime, roomId) {
  const context = await ensureAnalyticsEntity(runtime, roomId);
  const { entityId, effectiveRoomId, effectiveWorldId } = context;
  const now = Date.now();
  const initialAnalytics = createEmptyAnalytics();
  const success = await runtime.createComponent({
    id: v4_default(),
    entityId,
    agentId: runtime.agentId,
    roomId: effectiveRoomId,
    worldId: effectiveWorldId,
    sourceEntityId: runtime.agentId,
    type: ANALYTICS_COMPONENT_TYPE,
    createdAt: now,
    data: createStoredField("analytics", initialAnalytics)
  });
  if (!success) {
    throw new Error(
      `[DJ Analytics] Failed to create analytics component for room ${roomId}`
    );
  }
  return await runtime.getComponent(
    entityId,
    ANALYTICS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
}
async function trackTrackPlayed(runtime, roomId, track, duration, requestedBy) {
  const entityId = getAnalyticsEntityId(runtime, roomId);
  let component = await runtime.getComponent(
    entityId,
    ANALYTICS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    component = await runtime.getComponent(
      roomId,
      ANALYTICS_COMPONENT_TYPE,
      void 0,
      runtime.agentId
    );
  }
  if (!component) {
    const newComponent = await initializeAnalytics(runtime, roomId);
    if (!newComponent) {
      throw new Error(
        `[DJ Analytics] Failed to initialize analytics for room ${roomId}`
      );
    }
    component = newComponent;
  }
  const analytics = getStoredField(component, "analytics") ?? createEmptyAnalytics();
  analytics.totalTracksPlayed += 1;
  analytics.totalPlayTime += duration;
  const trackIndex = analytics.mostPlayedTracks.findIndex(
    (t) => t.url === track.url
  );
  const now = Date.now();
  if (trackIndex >= 0) {
    analytics.mostPlayedTracks[trackIndex].playCount += 1;
    analytics.mostPlayedTracks[trackIndex].lastPlayed = now;
  } else {
    analytics.mostPlayedTracks.push({
      url: track.url,
      title: track.title,
      playCount: 1,
      lastPlayed: now
    });
  }
  analytics.mostPlayedTracks.sort((a, b) => b.playCount - a.playCount);
  analytics.mostPlayedTracks = analytics.mostPlayedTracks.slice(0, 100);
  if (requestedBy) {
    const requesterIndex = analytics.mostRequestedBy.findIndex(
      (r) => r.entityId === requestedBy.entityId
    );
    if (requesterIndex >= 0) {
      analytics.mostRequestedBy[requesterIndex].requestCount += 1;
    } else {
      analytics.mostRequestedBy.push({
        entityId: requestedBy.entityId,
        name: requestedBy.name,
        requestCount: 1
      });
    }
    analytics.mostRequestedBy.sort((a, b) => b.requestCount - a.requestCount);
    analytics.mostRequestedBy = analytics.mostRequestedBy.slice(0, 50);
  }
  const hour = (/* @__PURE__ */ new Date()).getHours();
  analytics.popularTimes[hour].playCount += 1;
  const day = (/* @__PURE__ */ new Date()).getDay();
  analytics.popularDays[day].playCount += 1;
  const milestones = [
    { type: "tracks_100", value: 100 },
    { type: "tracks_500", value: 500 },
    { type: "tracks_1000", value: 1e3 },
    { type: "tracks_5000", value: 5e3 },
    { type: "tracks_10000", value: 1e4 }
  ];
  for (const milestone of milestones) {
    if (analytics.totalTracksPlayed === milestone.value && !analytics.milestones.some((m) => m.type === milestone.type)) {
      analytics.milestones.push({
        type: milestone.type,
        value: milestone.value,
        timestamp: now
      });
      await runtime.emitEvent(["DJ_MILESTONE"], {
        runtime,
        roomId,
        metadata: {
          type: milestone.type,
          value: milestone.value,
          timestamp: now
        }
      });
    }
  }
  await runtime.updateComponent({
    ...component,
    data: mergeStoredField(component, "analytics", analytics)
  });
}
async function trackSession(runtime, roomId, duration) {
  const entityId = getAnalyticsEntityId(runtime, roomId);
  let component = await runtime.getComponent(
    entityId,
    ANALYTICS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    component = await runtime.getComponent(
      roomId,
      ANALYTICS_COMPONENT_TYPE,
      void 0,
      runtime.agentId
    );
  }
  if (!component) {
    const newComponent = await initializeAnalytics(runtime, roomId);
    if (!newComponent) {
      throw new Error(
        `[DJ Analytics] Failed to initialize analytics for room ${roomId}`
      );
    }
    component = newComponent;
  }
  const analytics = getStoredField(component, "analytics") ?? createEmptyAnalytics();
  analytics.sessionStats.totalSessions += 1;
  const totalDuration = analytics.sessionStats.averageSessionDuration * (analytics.sessionStats.totalSessions - 1) + duration;
  analytics.sessionStats.averageSessionDuration = totalDuration / analytics.sessionStats.totalSessions;
  analytics.sessionStats.longestSession = Math.max(
    analytics.sessionStats.longestSession,
    duration
  );
  await runtime.updateComponent({
    ...component,
    data: mergeStoredField(component, "analytics", analytics)
  });
}
async function trackListenerSnapshot(runtime, roomId, snapshot) {
  const setup = await ensureAnalyticsEntity(runtime, roomId);
  const { entityId, effectiveRoomId, effectiveWorldId } = setup;
  let component = await runtime.getComponent(
    entityId,
    ANALYTICS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    const created = await runtime.createComponent({
      id: v4_default(),
      entityId,
      agentId: runtime.agentId,
      roomId: effectiveRoomId,
      worldId: effectiveWorldId,
      sourceEntityId: runtime.agentId,
      type: ANALYTICS_COMPONENT_TYPE,
      createdAt: Date.now(),
      data: createStoredField("listenerHistory", [])
    });
    if (!created) {
      throw new Error(
        `[DJ Analytics] Failed to create listener tracking component for room ${roomId}`
      );
    }
    component = await runtime.getComponent(
      entityId,
      ANALYTICS_COMPONENT_TYPE,
      void 0,
      runtime.agentId
    );
    if (!component) {
      throw new Error(
        `[DJ Analytics] Listener tracking component missing after creation for room ${roomId}`
      );
    }
  }
  const listenerHistory = getStoredField(component, "listenerHistory") ?? [];
  listenerHistory.push(snapshot);
  const MAX_SNAPSHOTS = 1440;
  if (listenerHistory.length > MAX_SNAPSHOTS) {
    listenerHistory.splice(0, listenerHistory.length - MAX_SNAPSHOTS);
  }
  await runtime.updateComponent({
    ...component,
    data: mergeStoredField(component, "listenerHistory", listenerHistory)
  });
}

// src/components/djTips.ts
import {
  createUniqueUuid as createUniqueUuid3,
  logger as logger21
} from "@elizaos/core";
var DJ_TIPS_COMPONENT_TYPE = "dj_tips";
var DJ_TIPS_ENTITY_PREFIX = "dj-tips";
function getDJTipsEntityId(runtime) {
  return createUniqueUuid3(
    runtime,
    `${DJ_TIPS_ENTITY_PREFIX}-${runtime.agentId}`
  );
}
async function trackDJTip(runtime, roomId, tip) {
  const entityId = getDJTipsEntityId(runtime);
  let component = await runtime.getComponent(
    entityId,
    DJ_TIPS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    const storageContext = await ensureAgentStorageContext(
      runtime,
      "dj-tips",
      "radio-plugin"
    );
    component = {
      id: v4_default(),
      entityId,
      agentId: runtime.agentId,
      roomId: storageContext.roomId,
      worldId: storageContext.worldId,
      sourceEntityId: runtime.agentId,
      type: DJ_TIPS_COMPONENT_TYPE,
      createdAt: Date.now(),
      data: {
        totalTips: 0,
        totalAmount: {},
        tips: [],
        topTippers: []
      }
    };
    await runtime.createComponent(component);
  }
  const stats = component.data;
  const tipWithRoom = { ...tip, roomId };
  stats.tips.push(tipWithRoom);
  stats.totalTips++;
  if (!stats.totalAmount) stats.totalAmount = {};
  stats.totalAmount[tip.currency] = (stats.totalAmount[tip.currency] || 0) + tip.amount;
  if (!stats.topTippers) stats.topTippers = [];
  const tipperIndex = stats.topTippers.findIndex(
    (t) => t.userId === tip.fromUserId
  );
  if (tipperIndex >= 0) {
    stats.topTippers[tipperIndex].totalAmount += tip.amount;
    stats.topTippers[tipperIndex].tipCount++;
  } else {
    stats.topTippers.push({
      userId: tip.fromUserId,
      username: tip.from,
      totalAmount: tip.amount,
      currency: tip.currency,
      tipCount: 1
    });
  }
  stats.topTippers.sort((a, b) => b.totalAmount - a.totalAmount);
  if (stats.tips.length > 100) {
    stats.tips = stats.tips.slice(-100);
  }
  await runtime.updateComponent({
    ...component,
    data: stats
  });
  logger21.info(`Tracked DJ tip: ${tip.amount} ${tip.currency} from ${tip.from}`);
}
async function getDJTipStats(runtime) {
  const entityId = getDJTipsEntityId(runtime);
  const component = await runtime.getComponent(
    entityId,
    DJ_TIPS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component?.data) {
    return {
      totalTips: 0,
      totalAmount: {},
      tips: [],
      topTippers: []
    };
  }
  return component.data;
}
async function getRecentTips(runtime, limit = 10) {
  const stats = await getDJTipStats(runtime);
  return stats.tips.slice(-limit).reverse();
}
async function getTopTippers(runtime, limit = 10) {
  const stats = await getDJTipStats(runtime);
  return stats.topTippers.slice(0, limit);
}

// src/components/preferences.ts
var PREFERENCES_COMPONENT_TYPE = "dj_preferences";
async function updateUserPreferences(runtime, entityId, preferences, roomId, worldId) {
  const existingComponent = await runtime.getComponent(
    entityId,
    PREFERENCES_COMPONENT_TYPE,
    worldId,
    runtime.agentId
  );
  const current = getStoredField(existingComponent, "preferences") ?? {};
  const updated = {
    ...current,
    ...preferences,
    // Merge arrays
    favoriteGenres: [
      .../* @__PURE__ */ new Set([
        ...current.favoriteGenres || [],
        ...preferences.favoriteGenres || []
      ])
    ],
    favoriteArtists: [
      .../* @__PURE__ */ new Set([
        ...current.favoriteArtists || [],
        ...preferences.favoriteArtists || []
      ])
    ],
    favoriteTracks: mergeFavoriteTracks(
      current.favoriteTracks || [],
      preferences.favoriteTracks || []
    ),
    dislikedTracks: [
      .../* @__PURE__ */ new Set([
        ...current.dislikedTracks || [],
        ...preferences.dislikedTracks || []
      ])
    ],
    skipHistory: [
      ...current.skipHistory || [],
      ...preferences.skipHistory || []
    ].slice(-100),
    // Keep last 100
    requestHistory: [
      ...current.requestHistory || [],
      ...preferences.requestHistory || []
    ].slice(-100),
    listeningSessions: [
      ...current.listeningSessions || [],
      ...preferences.listeningSessions || []
    ].slice(-50)
  };
  if (existingComponent) {
    await runtime.updateComponent({
      ...existingComponent,
      data: mergeStoredField(existingComponent, "preferences", updated)
    });
  } else {
    const entity = await runtime.getEntityById(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }
    if (!roomId) {
      throw new Error(
        "[DJ Preferences] roomId is required when creating a preferences component"
      );
    }
    const roomContext = await requireRoomContext(
      runtime,
      roomId,
      "DJ Preferences"
    );
    if (worldId && worldId !== roomContext.worldId) {
      throw new Error(
        `[DJ Preferences] worldId ${worldId} does not match room ${roomId} world ${roomContext.worldId}`
      );
    }
    await runtime.createComponent({
      id: v4_default(),
      entityId,
      agentId: runtime.agentId,
      roomId: roomContext.roomId,
      worldId: roomContext.worldId,
      sourceEntityId: runtime.agentId,
      type: PREFERENCES_COMPONENT_TYPE,
      createdAt: Date.now(),
      data: createStoredField("preferences", updated)
    });
  }
  return updated;
}
async function getUserPreferences(runtime, entityId) {
  const component = await runtime.getComponent(
    entityId,
    PREFERENCES_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  return getStoredField(component, "preferences");
}
async function getRoomPreferences(runtime, roomId) {
  const entities = await runtime.getEntitiesForRoom(roomId, true);
  const preferences = /* @__PURE__ */ new Map();
  for (const entity of entities) {
    if (!entity.id) {
      continue;
    }
    const prefs = await getUserPreferences(runtime, entity.id);
    if (prefs) {
      preferences.set(entity.id, prefs);
    }
  }
  return preferences;
}
function mergeFavoriteTracks(current, newTracks) {
  if (!newTracks || newTracks.length === 0) {
    return current || [];
  }
  const trackMap = /* @__PURE__ */ new Map();
  (current || []).forEach((track) => {
    trackMap.set(track.url, { ...track, playCount: track.playCount || 1 });
  });
  newTracks.forEach((track) => {
    const existing = trackMap.get(track.url);
    if (existing) {
      trackMap.set(track.url, {
        ...existing,
        playCount: (existing.playCount || 1) + 1
      });
    } else {
      trackMap.set(track.url, { ...track, playCount: 1 });
    }
  });
  return Array.from(trackMap.values()).sort(
    (a, b) => (b.playCount || 0) - (a.playCount || 0)
  );
}
async function trackTrackRequest(runtime, entityId, track, roomId, worldId) {
  await updateUserPreferences(
    runtime,
    entityId,
    {
      requestHistory: [
        {
          url: track.url,
          title: track.title,
          timestamp: Date.now()
        }
      ]
    },
    roomId,
    worldId
  );
}
async function trackSkip(runtime, entityId, trackUrl, roomId, worldId) {
  await updateUserPreferences(
    runtime,
    entityId,
    {
      skipHistory: [
        {
          url: trackUrl,
          timestamp: Date.now()
        }
      ]
    },
    roomId,
    worldId
  );
}
async function trackFavorite(runtime, entityId, track, roomId, worldId) {
  await updateUserPreferences(
    runtime,
    entityId,
    {
      favoriteTracks: [track]
    },
    roomId,
    worldId
  );
}

// src/components/repetitionControl.ts
import { logger as logger22 } from "@elizaos/core";
var RepetitionControl = class {
  playHistory = /* @__PURE__ */ new Map();
  // key: guildId
  MAX_HISTORY_SIZE = 100;
  // Keep last 100 plays per guild
  MIN_REPLAY_INTERVAL = 60 * 60 * 1e3;
  // 1 hour minimum between replays
  /**
   * Record a track play
   */
  recordPlay(guildId, url, title) {
    if (!this.playHistory.has(guildId)) {
      this.playHistory.set(guildId, []);
    }
    const history = this.playHistory.get(guildId);
    if (!history) {
      throw new Error(
        `[RepetitionControl] Missing play history bucket for guild ${guildId}`
      );
    }
    history.push({
      url,
      title,
      playedAt: Date.now()
    });
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.shift();
    }
  }
  /**
   * Check if a track can be played (not played too recently)
   */
  canPlay(guildId, url, minInterval) {
    const history = this.playHistory.get(guildId);
    if (!history || history.length === 0) {
      return true;
    }
    const interval = minInterval || this.MIN_REPLAY_INTERVAL;
    const now = Date.now();
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].url === url) {
        const timeSincePlay = now - history[i].playedAt;
        if (timeSincePlay < interval) {
          logger22.debug(
            `Repetition control: ${url} played ${Math.round(timeSincePlay / 1e3 / 60)} minutes ago (min: ${interval / 1e3 / 60} minutes)`
          );
          return false;
        }
        break;
      }
    }
    return true;
  }
  /**
   * Get recently played tracks for a guild
   */
  getRecentlyPlayed(guildId, count = 10) {
    const history = this.playHistory.get(guildId);
    if (!history || history.length === 0) {
      return [];
    }
    return history.slice(-count).reverse();
  }
  /**
   * Filter tracks to avoid repetition
   */
  filterRepetition(guildId, tracks, minInterval) {
    return tracks.filter(
      (track) => this.canPlay(guildId, track.url, minInterval)
    );
  }
  /**
   * Get play count for a track in recent history
   */
  getRecentPlayCount(guildId, url, timeWindow = 24 * 60 * 60 * 1e3) {
    const history = this.playHistory.get(guildId);
    if (!history || history.length === 0) {
      return 0;
    }
    const now = Date.now();
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (now - entry.playedAt > timeWindow) {
        break;
      }
      if (entry.url === url) {
        count++;
      }
    }
    return count;
  }
  /**
   * Score tracks based on variety (lower score = played less recently)
   */
  scoreByVariety(guildId, tracks) {
    const history = this.playHistory.get(guildId);
    const now = Date.now();
    return tracks.map((track) => {
      let score = 0;
      if (history && history.length > 0) {
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].url === track.url) {
            const timeSincePlay = now - history[i].playedAt;
            const hoursAgo = timeSincePlay / (1e3 * 60 * 60);
            if (hoursAgo < 1) {
              score += 100;
            } else if (hoursAgo < 3) {
              score += 50;
            } else if (hoursAgo < 6) {
              score += 25;
            } else if (hoursAgo < 24) {
              score += 10;
            } else {
              score += 1;
            }
          }
        }
      }
      return {
        ...track,
        varietyScore: score
      };
    });
  }
  /**
   * Clear history for a guild
   */
  clearHistory(guildId) {
    this.playHistory.delete(guildId);
  }
  /**
   * Get statistics for a guild
   */
  getStats(guildId) {
    const history = this.playHistory.get(guildId);
    if (!history || history.length === 0) {
      return {
        totalPlays: 0,
        uniqueTracks: 0,
        averageRepeatInterval: 0
      };
    }
    const uniqueUrls = new Set(history.map((entry) => entry.url));
    const urlLastPlayed = /* @__PURE__ */ new Map();
    let totalInterval = 0;
    let intervalCount = 0;
    for (const entry of history) {
      const lastPlayed = urlLastPlayed.get(entry.url);
      if (lastPlayed !== void 0) {
        totalInterval += entry.playedAt - lastPlayed;
        intervalCount++;
      }
      urlLastPlayed.set(entry.url, entry.playedAt);
    }
    return {
      totalPlays: history.length,
      uniqueTracks: uniqueUrls.size,
      averageRepeatInterval: intervalCount > 0 ? totalInterval / intervalCount : 0
    };
  }
};
var repetitionControl = new RepetitionControl();

// src/components/songMemory.ts
import { createUniqueUuid as createUniqueUuid4 } from "@elizaos/core";
var SONG_MEMORY_COMPONENT_TYPE = "song_memory";
var SONG_MEMORY_ENTITY_PREFIX = "song-memory";
function getSongMemoryEntityId(runtime, url) {
  return createUniqueUuid4(runtime, `${SONG_MEMORY_ENTITY_PREFIX}-${url}`);
}
async function getSongMemory(runtime, url) {
  const entityId = getSongMemoryEntityId(runtime, url);
  const component = await runtime.getComponent(
    entityId,
    SONG_MEMORY_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  return getStoredField(component, "memory");
}
async function createSongMemory(runtime, song) {
  const entityId = getSongMemoryEntityId(runtime, song.url);
  const memory = {
    url: song.url,
    title: song.title,
    artist: song.artist,
    album: song.album,
    duration: song.duration,
    totalPlays: 0,
    totalPlayTime: 0,
    lastPlayed: 0,
    firstPlayed: Date.now(),
    totalRequests: 0,
    uniqueRequesters: 0,
    topRequesters: [],
    totalLikes: 0,
    totalDislikes: 0,
    skipCount: 0,
    completionRate: 100,
    playedInRooms: [],
    dedicationCount: 0,
    dedications: [],
    popularHours: Array(24).fill(0),
    popularDays: Array(7).fill(0),
    averageListenerCount: 0,
    peakListenerCount: 0,
    listenerEngagement: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const storageContext = await ensureAgentStorageContext(
    runtime,
    "song-memory",
    "music-library"
  );
  await runtime.createComponent({
    id: v4_default(),
    entityId,
    agentId: runtime.agentId,
    roomId: storageContext.roomId,
    worldId: storageContext.worldId,
    sourceEntityId: runtime.agentId,
    type: SONG_MEMORY_COMPONENT_TYPE,
    createdAt: Date.now(),
    data: createStoredField("memory", memory)
  });
  return memory;
}
async function recordSongPlay(runtime, song, context) {
  let memory = await getSongMemory(runtime, song.url);
  if (!memory) {
    memory = await createSongMemory(runtime, song);
  }
  const now = Date.now();
  const hour = new Date(now).getHours();
  const day = new Date(now).getDay();
  memory.totalPlays++;
  memory.totalPlayTime += context.playDuration;
  memory.lastPlayed = now;
  memory.updatedAt = now;
  memory.popularHours[hour]++;
  memory.popularDays[day]++;
  if (context.roomId) {
    const roomStat = memory.playedInRooms.find(
      (r) => r.roomId === context.roomId
    );
    if (roomStat) {
      roomStat.playCount++;
      roomStat.lastPlayed = now;
    } else {
      memory.playedInRooms.push({
        roomId: context.roomId,
        playCount: 1,
        lastPlayed: now
      });
    }
  }
  if (context.listenerCount !== void 0) {
    const totalListeners = memory.averageListenerCount * (memory.totalPlays - 1) + context.listenerCount;
    memory.averageListenerCount = totalListeners / memory.totalPlays;
    memory.peakListenerCount = Math.max(
      memory.peakListenerCount,
      context.listenerCount
    );
  }
  if (context.wasSkipped) {
    memory.skipCount++;
  }
  const expectedDuration = song.duration || 18e4;
  const completionPercent = context.playDuration / expectedDuration * 100;
  const totalCompletion = memory.completionRate * (memory.totalPlays - 1) + completionPercent;
  memory.completionRate = totalCompletion / memory.totalPlays;
  await updateSongMemory(runtime, song.url, memory);
}
async function recordSongRequest(runtime, song, requester) {
  let memory = await getSongMemory(runtime, song.url);
  if (!memory) {
    memory = await createSongMemory(runtime, song);
  }
  memory.totalRequests++;
  memory.updatedAt = Date.now();
  const requesterStat = memory.topRequesters.find(
    (r) => r.entityId === requester.entityId
  );
  if (requesterStat) {
    requesterStat.count++;
  } else {
    memory.topRequesters.push({
      entityId: requester.entityId,
      name: requester.name,
      count: 1
    });
    memory.uniqueRequesters++;
  }
  memory.topRequesters.sort((a, b) => b.count - a.count);
  memory.topRequesters = memory.topRequesters.slice(0, 10);
  await updateSongMemory(runtime, song.url, memory);
}
async function recordSongDedication(runtime, url, dedication) {
  const memory = await getSongMemory(runtime, url);
  if (!memory) {
    throw new Error(
      `[Song Memory] Cannot record dedication for unknown song ${url}`
    );
  }
  memory.dedicationCount++;
  memory.dedications.push({
    ...dedication,
    timestamp: Date.now()
  });
  if (memory.dedications.length > 50) {
    memory.dedications = memory.dedications.slice(-50);
  }
  memory.updatedAt = Date.now();
  await updateSongMemory(runtime, url, memory);
}
async function updateSongMemory(runtime, url, memory) {
  const entityId = getSongMemoryEntityId(runtime, url);
  const component = await runtime.getComponent(
    entityId,
    SONG_MEMORY_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  if (!component) {
    throw new Error(`[Song Memory] Component not found for ${url}`);
  }
  await runtime.updateComponent({
    ...component,
    data: mergeStoredField(component, "memory", memory)
  });
}
async function getTopSongs(_runtime, _limit = 10) {
  throw new Error(
    "[Song Memory] getTopSongs requires runtime-level component indexing support"
  );
}
async function getMostRequestedSongs(_runtime, _limit = 10) {
  throw new Error(
    "[Song Memory] getMostRequestedSongs requires runtime-level component indexing support"
  );
}

// src/services/spotifyClient.ts
import { logger as logger23 } from "@elizaos/core";
import { Buffer as Buffer2 } from "buffer";
var SpotifyClient = class {
  clientId = null;
  clientSecret = null;
  token = null;
  baseUrl = "https://api.spotify.com/v1";
  authUrl = "https://accounts.spotify.com/api/token";
  // Rate limiting: 180 requests per minute for web API
  lastRequestTime = 0;
  minRequestInterval = 334;
  // ~180 requests per minute
  constructor(clientId, clientSecret) {
    this.clientId = clientId || null;
    this.clientSecret = clientSecret || null;
  }
  /**
   * Check if API credentials are configured
   */
  isConfigured() {
    return !!(this.clientId && this.clientSecret);
  }
  /**
   * Get or refresh access token
   */
  async getAccessToken() {
    if (!this.clientId || !this.clientSecret) {
      return null;
    }
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token.accessToken;
    }
    try {
      const response = await fetch(this.authUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer2.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`
        },
        body: "grant_type=client_credentials"
      });
      if (!response.ok) {
        logger23.warn(
          `Failed to get Spotify access token: ${response.status} ${response.statusText}`
        );
        return null;
      }
      const data = await response.json();
      this.token = {
        accessToken: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1e3 - 6e4
        // Refresh 1 minute early
      };
      return this.token.accessToken;
    } catch (error) {
      logger23.error(`Error getting Spotify access token: ${error}`);
      return null;
    }
  }
  /**
   * Rate limiting helper
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(
        (resolve) => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }
  /**
   * Search for a track on Spotify
   */
  async searchTrack(query) {
    if (!this.isConfigured()) {
      return null;
    }
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return null;
    }
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodedQuery}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          this.token = null;
          throw new Error("Spotify token expired");
        }
        throw new Error(
          `Spotify search failed: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.tracks.items.length === 0) {
        return null;
      }
      return data.tracks.items[0].id;
    });
  }
  /**
   * Get audio features for a track
   */
  async getAudioFeatures(trackId) {
    if (!this.isConfigured()) {
      return null;
    }
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return null;
    }
    await this.rateLimit();
    return retryWithBackoff(async () => {
      const response = await fetch(
        `${this.baseUrl}/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          this.token = null;
          throw new Error("Spotify token expired");
        }
        if (response.status === 404) {
          return null;
        }
        throw new Error(
          `Spotify audio features request failed: ${response.status}`
        );
      }
      const data = await response.json();
      return {
        trackId: data.id,
        danceability: data.danceability,
        energy: data.energy,
        valence: data.valence,
        acousticness: data.acousticness,
        instrumentalness: data.instrumentalness,
        liveness: data.liveness,
        speechiness: data.speechiness,
        key: data.key,
        mode: data.mode,
        tempo: data.tempo,
        timeSignature: data.time_signature,
        loudness: data.loudness,
        duration: data.duration_ms,
        source: "spotify"
      };
    });
  }
  /**
   * Get audio features for a track by search query
   */
  async getAudioFeaturesByQuery(query) {
    const trackId = await this.searchTrack(query);
    if (!trackId) {
      return null;
    }
    return this.getAudioFeatures(trackId);
  }
  /**
   * Get track recommendations
   */
  async getRecommendations(request) {
    if (!this.isConfigured()) {
      return [];
    }
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return [];
    }
    const params = new URLSearchParams();
    if (request.seedArtists && request.seedArtists.length > 0) {
      params.append("seed_artists", request.seedArtists.slice(0, 5).join(","));
    }
    if (request.seedTracks && request.seedTracks.length > 0) {
      params.append("seed_tracks", request.seedTracks.slice(0, 5).join(","));
    }
    if (request.seedGenres && request.seedGenres.length > 0) {
      params.append("seed_genres", request.seedGenres.slice(0, 5).join(","));
    }
    if (request.audioFeatures) {
      const features = request.audioFeatures;
      if (features.targetDanceability !== void 0) {
        params.append(
          "target_danceability",
          features.targetDanceability.toString()
        );
      }
      if (features.targetEnergy !== void 0) {
        params.append("target_energy", features.targetEnergy.toString());
      }
      if (features.targetValence !== void 0) {
        params.append("target_valence", features.targetValence.toString());
      }
      if (features.targetTempo !== void 0) {
        params.append("target_tempo", features.targetTempo.toString());
      }
      if (features.targetLoudness !== void 0) {
        params.append("target_loudness", features.targetLoudness.toString());
      }
      if (features.targetAcousticness !== void 0) {
        params.append(
          "target_acousticness",
          features.targetAcousticness.toString()
        );
      }
      if (features.targetInstrumentalness !== void 0) {
        params.append(
          "target_instrumentalness",
          features.targetInstrumentalness.toString()
        );
      }
      if (features.targetPopularity !== void 0) {
        params.append(
          "target_popularity",
          features.targetPopularity.toString()
        );
      }
    }
    params.append("limit", (request.limit || 20).toString());
    await this.rateLimit();
    return retryWithBackoff(
      async () => {
        const response = await fetch(
          `${this.baseUrl}/recommendations?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            this.token = null;
            throw new Error("Spotify token expired");
          }
          throw new Error(
            `Spotify recommendations request failed: ${response.status}`
          );
        }
        const data = await response.json();
        return data.tracks.map((track) => ({
          trackName: track.name,
          artistName: track.artists.map((a) => a.name).join(", "),
          albumName: track.album.name,
          url: track.external_urls.spotify,
          previewUrl: track.preview_url,
          popularity: track.popularity
        }));
      },
      {
        maxRetries: 2
        // Fewer retries for recommendations
      }
    );
  }
  /**
   * Validate API credentials
   */
  async validateCredentials() {
    if (!this.isConfigured()) {
      return false;
    }
    const token = await this.getAccessToken();
    return token !== null;
  }
};

// src/services/musicLibraryService.ts
var MUSIC_LIBRARY_SERVICE_NAME5 = "musicLibrary";
var MusicLibraryService = class _MusicLibraryService extends Service3 {
  static serviceType = MUSIC_LIBRARY_SERVICE_NAME5;
  capabilityDescription = "Music recommendations based on what you like";
  spotifyClient;
  repetitionControl = repetitionControl;
  constructor(runtime) {
    super(runtime);
    const clientId = runtime?.getSetting("SPOTIFY_CLIENT_ID");
    const clientSecret = runtime?.getSetting("SPOTIFY_CLIENT_SECRET");
    this.spotifyClient = new SpotifyClient(clientId, clientSecret);
  }
  static async start(runtime) {
    logger24.debug(
      `Starting MusicLibraryService for agent ${runtime.character.name}`
    );
    return new _MusicLibraryService(runtime);
  }
  async stop() {
  }
  ensureRuntime() {
    if (!this.runtime) {
      throw new Error("MusicLibraryService runtime is not available");
    }
    return this.runtime;
  }
  // === Library storage ===
  async addSong(songData) {
    logger24.info(
      `[MusicLibraryService] addSong called: "${songData.title}" (${songData.url})`
    );
    try {
      const result = await addSongToLibrary(this.ensureRuntime(), songData);
      logger24.info(
        `[MusicLibraryService] \u2705 Song saved: "${result.title}" (${result.playCount} plays)`
      );
      return result;
    } catch (error) {
      logger24.error(`[MusicLibraryService] \u274C Failed to save song: ${error}`);
      throw error;
    }
  }
  async getSong(url) {
    return getSong(this.ensureRuntime(), url);
  }
  async getRecentSongs(limit) {
    return getRecentSongs(this.ensureRuntime(), limit);
  }
  async getLastPlayedSong() {
    return getLastPlayedSong(this.ensureRuntime());
  }
  async getMostPlayedSongs(limit) {
    return getMostPlayedSongs(this.ensureRuntime(), limit);
  }
  async searchLibrary(query, limit) {
    return searchLibrary(this.ensureRuntime(), query, limit);
  }
  async getLibraryStats() {
    return getLibraryStats(this.ensureRuntime());
  }
  // === Playlists ===
  async savePlaylist(entityId, playlist) {
    return savePlaylist(this.ensureRuntime(), entityId, playlist);
  }
  async loadPlaylists(entityId) {
    return loadPlaylists(this.ensureRuntime(), entityId);
  }
  async deletePlaylist(entityId, playlistId) {
    return deletePlaylist(this.ensureRuntime(), entityId, playlistId);
  }
  // === Preferences ===
  async getUserPreferences(entityId) {
    return getUserPreferences(this.ensureRuntime(), entityId);
  }
  async getRoomPreferences(roomId) {
    return getRoomPreferences(this.ensureRuntime(), roomId);
  }
  async getAggregatedRoomPreferences(roomId) {
    try {
      const preferences = await this.getRoomPreferences(roomId);
      const favoriteTrackMap = /* @__PURE__ */ new Map();
      const dislikedTracks = /* @__PURE__ */ new Set();
      for (const [entityId, prefs] of preferences.entries()) {
        if (prefs.favoriteTracks) {
          for (const track of prefs.favoriteTracks) {
            if (!track.url) continue;
            const existing = favoriteTrackMap.get(track.url);
            if (existing) {
              existing.playCount += track.playCount || 1;
              existing.requestedBy.add(entityId);
            } else {
              favoriteTrackMap.set(track.url, {
                url: track.url,
                title: track.title || "Unknown Title",
                playCount: track.playCount || 1,
                requestedBy: /* @__PURE__ */ new Set([entityId])
              });
            }
          }
        }
        if (prefs.dislikedTracks) {
          for (const url of prefs.dislikedTracks) {
            dislikedTracks.add(url);
          }
        }
      }
      const favoriteTracks = Array.from(favoriteTrackMap.values()).map((entry) => ({
        url: entry.url,
        title: entry.title,
        playCount: entry.playCount,
        requestedBy: Array.from(entry.requestedBy)
      })).sort((a, b) => b.playCount - a.playCount);
      return {
        favoriteTracks,
        dislikedTracks: Array.from(dislikedTracks)
      };
    } catch (error) {
      logger24.debug(
        `[MusicLibraryService] Failed to aggregate room preferences: ${error instanceof Error ? error.message : String(error)}`
      );
      return {
        favoriteTracks: [],
        dislikedTracks: []
      };
    }
  }
  async trackTrackRequest(entityId, track, roomId, worldId) {
    await trackTrackRequest(
      this.ensureRuntime(),
      entityId,
      track,
      roomId,
      worldId
    );
  }
  async trackSkip(entityId, trackUrl, roomId, worldId) {
    await trackSkip(this.ensureRuntime(), entityId, trackUrl, roomId, worldId);
  }
  async trackFavorite(entityId, track, roomId, worldId) {
    await trackFavorite(this.ensureRuntime(), entityId, track, roomId, worldId);
  }
  // === Analytics ===
  async trackTrackPlayed(roomId, track, duration, requestedBy) {
    await trackTrackPlayed(
      this.ensureRuntime(),
      roomId,
      track,
      duration,
      requestedBy
    );
  }
  async getAnalytics(roomId) {
    return getAnalytics(this.ensureRuntime(), roomId);
  }
  // === Song memory ===
  async getSongMemory(url) {
    return getSongMemory(this.ensureRuntime(), url);
  }
  async recordSongPlay(song, context) {
    await recordSongPlay(this.ensureRuntime(), song, context);
  }
  async recordSongRequest(song, requester) {
    await recordSongRequest(this.ensureRuntime(), song, requester);
  }
  async recordSongDedication(url, dedication) {
    await recordSongDedication(this.ensureRuntime(), url, dedication);
  }
  // === DJ tips ===
  async trackDJTip(roomId, tip) {
    await trackDJTip(this.ensureRuntime(), roomId, tip);
  }
  async getDJTipStats() {
    return getDJTipStats(this.ensureRuntime());
  }
};

// src/services/wikipediaClient.ts
import { logger as logger25, Service as Service4 } from "@elizaos/core";
var WIKIPEDIA_SERVICE_NAME = "wikipedia";
var WikipediaRateLimiter = class _WikipediaRateLimiter {
  static instance = null;
  lastRequestTime = 0;
  minRequestInterval = 500;
  // 500ms = 2 requests per second
  requestQueue = [];
  processing = false;
  static getInstance() {
    if (!_WikipediaRateLimiter.instance) {
      _WikipediaRateLimiter.instance = new _WikipediaRateLimiter();
    }
    return _WikipediaRateLimiter.instance;
  }
  /**
   * Wait for rate limit before making a request
   */
  async waitForRateLimit() {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      this.processQueue();
    });
  }
  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }
    this.processing = true;
    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.minRequestInterval) {
        await new Promise(
          (resolve2) => setTimeout(resolve2, this.minRequestInterval - timeSinceLastRequest)
        );
      }
      this.lastRequestTime = Date.now();
      const resolve = this.requestQueue.shift();
      if (resolve) {
        resolve();
      }
    }
    this.processing = false;
  }
};
var WikipediaService = class _WikipediaService extends Service4 {
  static serviceType = WIKIPEDIA_SERVICE_NAME;
  capabilityDescription = "Provides access to Wikipedia API with rate limiting";
  baseUrl = "https://en.wikipedia.org/api/rest_v1";
  searchUrl = "https://en.wikipedia.org/w/api.php";
  rateLimiter = WikipediaRateLimiter.getInstance();
  static async start(runtime) {
    logger25.debug(
      `Starting WikipediaService for agent ${runtime.character.name}`
    );
    return new _WikipediaService(runtime);
  }
  async stop() {
  }
  /**
   * Search for a Wikipedia page and get summary
   */
  async getPageSummary(title) {
    await this.rateLimiter.waitForRateLimit();
    try {
      const encodedTitle = encodeURIComponent(title);
      const url = `${this.baseUrl}/page/summary/${encodedTitle}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ElizaOS-MusicInfo/1.0.0 (https://github.com/elizaos/eliza)"
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        logger25.warn(
          `Wikipedia API error: ${response.status} ${response.statusText}`
        );
        return null;
      }
      return await response.json();
    } catch (error) {
      logger25.error(`Error fetching Wikipedia page: ${error}`);
      return null;
    }
  }
  /**
   * Search Wikipedia for pages matching a query
   */
  async searchPages(query, limit = 3) {
    await this.rateLimiter.waitForRateLimit();
    try {
      const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: query,
        srlimit: limit.toString(),
        format: "json",
        origin: "*"
      });
      const url = `${this.searchUrl}?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "ElizaOS-MusicInfo/1.0.0 (https://github.com/elizaos/eliza)"
        }
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      const searchResults = data.query?.search;
      if (!searchResults) {
        return [];
      }
      return searchResults.map((result) => ({
        title: result.title,
        snippet: result.snippet
      }));
    } catch (error) {
      logger25.error(`Error searching Wikipedia: ${error}`);
      return [];
    }
  }
  /**
   * Get track information from Wikipedia
   */
  async getTrackInfo(trackName, artistName) {
    try {
      let searchQuery = trackName;
      if (artistName) {
        searchQuery = `${trackName} ${artistName}`;
      }
      const searchResults = await this.searchPages(searchQuery, 5);
      for (const result of searchResults) {
        const title = result.title.toLowerCase();
        const snippet = result.snippet.toLowerCase();
        const trackLower = trackName.toLowerCase();
        if (title.includes(trackLower) || snippet.includes(trackLower)) {
          const page = await this.getPageSummary(result.title);
          if (page?.extract) {
            const trackInfo = {
              title: trackName,
              artist: artistName || this.extractArtistFromExtract(page.extract) || "Unknown Artist",
              description: this.cleanExtract(page.extract),
              url: page.content_urls?.desktop?.page
            };
            const yearMatch = page.extract.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
              trackInfo.year = parseInt(yearMatch[0], 10);
            }
            return trackInfo;
          }
        }
      }
      return null;
    } catch (error) {
      logger25.error(`Error getting Wikipedia track info: ${error}`);
      return null;
    }
  }
  /**
   * Get artist information from Wikipedia
   */
  async getArtistInfo(artistName) {
    try {
      let page = await this.getPageSummary(artistName);
      if (!page) {
        const searchResults = await this.searchPages(artistName, 3);
        if (searchResults.length > 0) {
          page = await this.getPageSummary(searchResults[0].title);
        }
      }
      if (!page?.extract) {
        return null;
      }
      const extract = page.extract;
      const artistInfo = {
        name: artistName,
        bio: this.cleanExtract(extract),
        image: page.thumbnail?.source
      };
      const genreKeywords = [
        "rock",
        "pop",
        "jazz",
        "hip hop",
        "rap",
        "country",
        "electronic",
        "classical",
        "blues",
        "folk",
        "metal",
        "punk",
        "reggae",
        "r&b",
        "soul",
        "funk",
        "disco",
        "indie",
        "alternative"
      ];
      const foundGenres = [];
      const extractLower = extract.toLowerCase();
      for (const genre of genreKeywords) {
        if (extractLower.includes(genre)) {
          foundGenres.push(genre);
        }
      }
      if (foundGenres.length > 0) {
        artistInfo.genres = foundGenres.slice(0, 5);
      }
      const relatedArtists = this.extractRelatedArtists(extract);
      if (relatedArtists.length > 0) {
        artistInfo.similarArtists = relatedArtists;
      }
      return artistInfo;
    } catch (error) {
      logger25.error(`Error getting Wikipedia artist info: ${error}`);
      return null;
    }
  }
  /**
   * Get album information from Wikipedia
   */
  async getAlbumInfo(albumTitle, artistName) {
    try {
      let searchQuery = albumTitle;
      if (artistName) {
        searchQuery = `${albumTitle} ${artistName}`;
      }
      const searchResults = await this.searchPages(searchQuery, 5);
      for (const result of searchResults) {
        const title = result.title.toLowerCase();
        const snippet = result.snippet.toLowerCase();
        const albumLower = albumTitle.toLowerCase();
        if (title.includes(albumLower) || snippet.includes(albumLower)) {
          const page = await this.getPageSummary(result.title);
          if (page?.extract) {
            const albumInfo = {
              title: albumTitle,
              artist: artistName || this.extractArtistFromExtract(page.extract) || "Unknown Artist",
              description: this.cleanExtract(page.extract),
              coverArt: page.thumbnail?.source
            };
            const yearMatch = page.extract.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
              albumInfo.year = parseInt(yearMatch[0], 10);
            }
            return albumInfo;
          }
        }
      }
      return null;
    } catch (error) {
      logger25.error(`Error getting Wikipedia album info: ${error}`);
      return null;
    }
  }
  /**
   * Clean Wikipedia extract text (remove HTML, truncate)
   */
  cleanExtract(extract, maxLength = 1e3) {
    let cleaned = extract.replace(/<[^>]*>/g, "");
    cleaned = cleaned.replace(/\[\d+\]/g, "");
    if (cleaned.length > maxLength) {
      cleaned = `${cleaned.substring(0, maxLength).trim()}...`;
    }
    return cleaned;
  }
  /**
   * Try to extract artist name from Wikipedia extract
   */
  extractArtistFromExtract(extract) {
    const patterns = [
      /\bby\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'s\s+(?:song|album|track)/i
    ];
    for (const pattern of patterns) {
      const match = extract.match(pattern);
      if (match?.[1]) {
        return match[1].trim();
      }
    }
    return null;
  }
  /**
   * Extract related artists, influences, and similar acts from Wikipedia extract
   * Looks for patterns like "influenced by", "similar to", "associated acts", etc.
   * This data helps drive intelligent music selection and discovery
   */
  extractRelatedArtists(extract) {
    const relatedArtists = /* @__PURE__ */ new Set();
    const patterns = [
      // Influences
      /(?:influenced by|inspired by|drew inspiration from)[:\s]+([^.]+)/i,
      // Similar artists
      /(?:similar to|comparable to|like)[:\s]+([^.]+)/i,
      // Associated acts
      /(?:associated acts|associated with|collaborated with)[:\s]+([^.]+)/i,
      // Musical influences
      /(?:musical influences|influences include)[:\s]+([^.]+)/i,
      // Genre peers
      /(?:alongside|along with|together with)[:\s]+([^.]+)/i
    ];
    for (const pattern of patterns) {
      const matches = extract.matchAll(new RegExp(pattern.source, "gi"));
      for (const match of matches) {
        if (match[1]) {
          const artistsText = match[1];
          const artists = artistsText.split(/[,;]| and | & /).map((a) => a.trim()).filter((a) => a.length > 0 && a.length < 100);
          for (const artist of artists) {
            const cleanArtist = artist.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
            if (cleanArtist.length > 2 && cleanArtist.length < 80 && /^[A-Z]/.test(cleanArtist)) {
              relatedArtists.add(cleanArtist);
            }
          }
        }
      }
    }
    return Array.from(relatedArtists).slice(0, 10);
  }
};

// src/services/wikipediaExtractionService.ts
import { logger as logger26, ModelType as ModelType3, Service as Service5 } from "@elizaos/core";
var WIKIPEDIA_EXTRACTION_SERVICE_NAME = "wikipediaExtraction";
var WikipediaExtractionService = class _WikipediaExtractionService extends Service5 {
  static serviceType = WIKIPEDIA_EXTRACTION_SERVICE_NAME;
  capabilityDescription = "Uses LLM to dynamically extract music information from Wikipedia based on context";
  cache = /* @__PURE__ */ new Map();
  CACHE_TTL = 36e5;
  // 1 hour in milliseconds
  static async start(runtime) {
    logger26.debug(
      `Starting WikipediaExtractionService for agent ${runtime.character.name}`
    );
    return new _WikipediaExtractionService(runtime);
  }
  getWikipediaService() {
    return this.runtime?.getService("wikipedia");
  }
  async stop() {
    this.clearCache();
  }
  /**
   * Extract music information from Wikipedia using LLM based on context
   */
  async extractFromWikipedia(entityName, entityType, context) {
    if (!this.runtime) {
      return null;
    }
    const cacheKey = `${entityType}:${entityName}:${context.purpose}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    try {
      const wikipediaService = this.getWikipediaService();
      if (!wikipediaService) {
        return null;
      }
      let wikiData = null;
      if (entityType === "artist") {
        const artistInfo = await wikipediaService.getArtistInfo(entityName);
        if (artistInfo) {
          wikiData = {
            type: "artist",
            name: entityName,
            bio: artistInfo.bio,
            genres: artistInfo.genres,
            similarArtists: artistInfo.similarArtists,
            image: artistInfo.image
          };
        }
      } else if (entityType === "song") {
        const trackInfo = await wikipediaService.getTrackInfo(entityName);
        if (trackInfo) {
          wikiData = {
            type: "song",
            name: entityName,
            description: trackInfo.description,
            artist: trackInfo.artist,
            album: trackInfo.album,
            year: trackInfo.year,
            genre: trackInfo.genre
          };
        }
      } else if (entityType === "album") {
        const albumInfo = await wikipediaService.getAlbumInfo(
          entityName,
          context.currentArtist
        );
        if (albumInfo) {
          wikiData = {
            type: "album",
            name: entityName,
            description: albumInfo.description,
            artist: albumInfo.artist,
            year: albumInfo.year,
            genre: albumInfo.genre
          };
        }
      }
      if (!wikiData) {
        return null;
      }
      const extractionPrompt = this.buildExtractionPrompt(wikiData, context);
      const extractionResponse = await this.runtime.useModel(
        ModelType3.TEXT_LARGE,
        {
          prompt: extractionPrompt,
          maxTokens: 500
        }
      );
      const extracted = this.parseExtractionResponse(
        extractionResponse,
        context
      );
      this.cache.set(cacheKey, {
        data: extracted,
        timestamp: Date.now()
      });
      return extracted;
    } catch (error) {
      logger26.error(`Error extracting Wikipedia info: ${error}`);
      return null;
    }
  }
  /**
   * Build extraction prompt based on context
   */
  buildExtractionPrompt(wikiData, context) {
    const basePrompt = `Extract relevant music information from the following Wikipedia data based on the context.

Wikipedia Data:
${JSON.stringify(wikiData, null, 2)}

Context: ${context.purpose}
${context.currentArtist ? `Current Artist: ${context.currentArtist}` : ""}
${context.currentTrack ? `Current Track: ${context.currentTrack}` : ""}
${context.currentAlbum ? `Current Album: ${context.currentAlbum}` : ""}

`;
    switch (context.purpose) {
      case "dj_intro":
        return basePrompt + `Extract information that would be interesting for a radio DJ introduction:
- Interesting facts and trivia about the artist/song (prioritize fun, surprising, or noteworthy facts)
- Genre and style information
- Related artists or influences
- Release year or historical context
- Any notable achievements, awards, or interesting backstories
- Fun anecdotes or stories about the song/artist
- Chart positions or commercial success (if notable)
- Cultural impact or significance

Format as JSON with keys: interestingFacts (array of strings - prioritize the most interesting/entertaining facts), genres (array), relatedArtists (array), influences (array), year (number if available).`;
      case "music_selection":
        return basePrompt + `Extract information that would help with intelligent music selection:
- Related artists and influences (for discovering similar music)
- Genre information
- Musical style characteristics
- Artists that influenced this artist
- Artists that were influenced by this artist

Format as JSON with keys: relatedArtists (array), influences (array), genres (array), selectionSuggestions (array of artist/song names).`;
      case "related_artists":
        return basePrompt + `Extract all related artists, influences, and similar acts:
- Artists that influenced this artist
- Artists influenced by this artist
- Similar artists or genre peers
- Associated acts or collaborators

Format as JSON with keys: influences (array), relatedArtists (array), similarArtists (array).`;
      default:
        return basePrompt + `Extract general music information:
- Genre and style
- Related artists
- Influences
- Interesting facts

Format as JSON with keys: genres (array), relatedArtists (array), influences (array), interestingFacts (array).`;
    }
  }
  /**
   * Parse LLM extraction response
   */
  parseExtractionResponse(response, _context) {
    const extracted = {};
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        extracted.relatedArtists = parsed.relatedArtists || parsed.similarArtists;
        extracted.influences = parsed.influences;
        extracted.genres = parsed.genres;
        extracted.interestingFacts = parsed.interestingFacts;
        extracted.selectionSuggestions = parsed.selectionSuggestions;
      } else {
        extracted.relatedArtists = this.extractList(
          response,
          /related[:\s]+(.*?)(?:\n|$)/i
        );
        extracted.influences = this.extractList(
          response,
          /influenc[es]*[:\s]+(.*?)(?:\n|$)/i
        );
        extracted.genres = this.extractList(
          response,
          /genre[s]*[:\s]+(.*?)(?:\n|$)/i
        );
        extracted.interestingFacts = this.extractList(
          response,
          /fact[s]*[:\s]+(.*?)(?:\n|$)/i
        );
      }
    } catch (error) {
      logger26.warn(`Failed to parse extraction response: ${error}`);
    }
    return extracted;
  }
  /**
   * Extract list items from text using pattern
   */
  extractList(text, pattern) {
    const match = text.match(pattern);
    if (!match?.[1]) {
      return [];
    }
    return match[1].split(/[,;]| and | & /).map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 10);
  }
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
};

// src/services/youtubeSearch.ts
import { logger as logger27, Service as Service6 } from "@elizaos/core";
var YOUTUBE_SEARCH_SERVICE_NAME = "youtubeSearch";
var YouTubeSearchService = class _YouTubeSearchService extends Service6 {
  static serviceType = YOUTUBE_SEARCH_SERVICE_NAME;
  capabilityDescription = "Searches YouTube for videos and returns metadata";
  cache = /* @__PURE__ */ new Map();
  CACHE_TTL = 36e5;
  // 1 hour
  static async start(runtime) {
    logger27.debug(
      `Starting YouTubeSearchService for agent ${runtime.character.name}`
    );
    return new _YouTubeSearchService(runtime);
  }
  async stop() {
    this.clearCache();
  }
  /**
   * Clear all cached searches
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Search YouTube for videos
   * @param query - Search query string
   * @param options - Search options
   * @returns Array of search results
   */
  async search(query, options = {}) {
    const { limit = 5, includeShorts = false } = options;
    const cacheKey = `${query}:${limit}:${includeShorts}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      logger27.debug(`YouTube search cache hit for: ${query}`);
      return cached.results;
    }
    try {
      const play = await import("@vookav2/play-dl").then((m) => m.default || m);
      logger27.debug(`Searching YouTube for: ${query} (limit: ${limit})`);
      let searchResults;
      try {
        searchResults = await play.search(query, {
          limit: limit * 2,
          // Get extra results for filtering
          source: { youtube: "video" }
        });
      } catch (error) {
        logger27.error(
          "Error in YouTube search API:",
          error instanceof Error ? error.message : String(error)
        );
        throw new Error(
          `YouTube search failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
      if (!searchResults || searchResults.length === 0) {
        logger27.warn(`No YouTube results found for: ${query}`);
        return [];
      }
      const results = [];
      for (const result of searchResults) {
        if (!result.url?.includes("youtube.com/watch")) {
          continue;
        }
        if (!includeShorts && result.url.includes("/shorts/")) {
          continue;
        }
        const channelName = result.channel?.name;
        const views = typeof result.views === "number" ? result.views : void 0;
        results.push({
          url: result.url,
          title: result.title || "Unknown Title",
          duration: typeof result.durationInSec === "number" ? result.durationInSec : void 0,
          channel: typeof channelName === "string" ? channelName : void 0,
          views
        });
        if (results.length >= limit) {
          break;
        }
      }
      this.cache.set(cacheKey, {
        results,
        timestamp: Date.now()
      });
      logger27.info(`Found ${results.length} YouTube results for: ${query}`);
      return results;
    } catch (error) {
      logger27.error(
        "Error in YouTubeSearchService:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }
  /**
   * Search and return the top result
   * @param query - Search query
   * @returns Top search result or null
   */
  async searchOne(query) {
    const results = await this.search(query, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  }
  /**
   * Validate if a URL is a valid YouTube video
   */
  async validateUrl(url) {
    try {
      const play = await import("@vookav2/play-dl").then((m) => m.default || m);
      return play.yt_validate(url) === "video";
    } catch (error) {
      logger27.error(
        "Error validating YouTube URL:",
        error instanceof Error ? error.message : String(error)
      );
      return false;
    }
  }
  /**
   * Get video info from URL
   */
  async getVideoInfo(url) {
    try {
      const play = await import("@vookav2/play-dl").then((m) => m.default || m);
      if (!play.yt_validate(url)) {
        return null;
      }
      const videoInfo = await play.video_info(url);
      if (!videoInfo) {
        return null;
      }
      const details = videoInfo.video_details;
      const channelName = details.channel?.name;
      return {
        url: details.url,
        title: details.title || "Unknown Title",
        duration: details.durationInSec,
        channel: typeof channelName === "string" ? channelName : void 0,
        views: details.views
      };
    } catch (error) {
      logger27.error(
        "Error getting video info:",
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }
};

// src/components/djGuildSettings.ts
import {
  createUniqueUuid as createUniqueUuid5,
  logger as logger28
} from "@elizaos/core";
var DEFAULT_GUILD_SETTINGS = {
  autonomyLevel: "BALANCED",
  enabled: true,
  autoFillEnabled: true,
  autoFillThreshold: 3,
  timeBasedProgramming: true,
  repetitionControlEnabled: true,
  introsEnabled: true,
  commentaryEnabled: false,
  useLLMForCommentary: true,
  jokesSetting: true,
  autoTriviaEnabled: true,
  autoTriviaMinTracks: 5,
  autoTriviaMinMinutes: 30,
  autoJokesEnabled: true,
  autoJokesMinTracks: 7,
  autoJokesMinMinutes: 20,
  autoRecapEnabled: true,
  autoRecapMinTracks: 4,
  autoRecapMinMinutes: 15,
  listenerTrackingEnabled: true,
  audioQuality: "high",
  crossFadeEnabled: true,
  crossFadeDuration: 3e3,
  createdAt: Date.now(),
  updatedAt: Date.now()
};
var DJ_GUILD_SETTINGS_COMPONENT_TYPE = "dj_guild_settings";
var DJ_GUILD_SETTINGS_ENTITY_PREFIX = "dj-guild-settings";
function getDJGuildSettingsEntityId(runtime, roomId) {
  return createUniqueUuid5(
    runtime,
    `${DJ_GUILD_SETTINGS_ENTITY_PREFIX}-${roomId}`
  );
}
async function getDJGuildSettings(runtime, roomId) {
  const entityId = getDJGuildSettingsEntityId(runtime, roomId);
  const component = await runtime.getComponent(
    entityId,
    DJ_GUILD_SETTINGS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  const storedSettings = getStoredField(component, "settings");
  if (!storedSettings) {
    return DEFAULT_GUILD_SETTINGS;
  }
  return {
    ...DEFAULT_GUILD_SETTINGS,
    ...storedSettings
  };
}
async function setDJGuildSettings(runtime, roomId, settings, modifiedBy) {
  try {
    const entityId = getDJGuildSettingsEntityId(runtime, roomId);
    const existingComponent = await runtime.getComponent(
      entityId,
      DJ_GUILD_SETTINGS_COMPONENT_TYPE,
      void 0,
      runtime.agentId
    );
    const storedSettings = getStoredField(
      existingComponent,
      "settings"
    );
    const currentSettings = storedSettings ? { ...DEFAULT_GUILD_SETTINGS, ...storedSettings } : DEFAULT_GUILD_SETTINGS;
    const newSettings = {
      ...currentSettings,
      ...settings,
      updatedAt: Date.now(),
      lastModifiedBy: modifiedBy || runtime.agentId
    };
    if (existingComponent) {
      await runtime.updateComponent({
        ...existingComponent,
        data: mergeStoredField(existingComponent, "settings", newSettings)
      });
    } else {
      const roomContext = await requireRoomContext(
        runtime,
        roomId,
        "DJ Guild Settings"
      );
      newSettings.createdAt = Date.now();
      newSettings.createdBy = modifiedBy || runtime.agentId;
      await runtime.createComponent({
        id: v4_default(),
        entityId,
        agentId: runtime.agentId,
        roomId: roomContext.roomId,
        worldId: roomContext.worldId,
        sourceEntityId: runtime.agentId,
        type: DJ_GUILD_SETTINGS_COMPONENT_TYPE,
        createdAt: Date.now(),
        data: createStoredField("settings", newSettings)
      });
    }
    logger28.info(`Updated DJ guild settings for room ${roomId}`);
  } catch (error) {
    logger28.error(`Error setting DJ guild settings: ${error}`);
    throw error;
  }
}
async function resetDJGuildSettings(runtime, roomId, modifiedBy) {
  await setDJGuildSettings(runtime, roomId, DEFAULT_GUILD_SETTINGS, modifiedBy);
}
async function toggleDJ(runtime, roomId, enabled, modifiedBy) {
  await setDJGuildSettings(runtime, roomId, { enabled }, modifiedBy);
}
async function setAutonomyLevel(runtime, roomId, level, modifiedBy) {
  await setDJGuildSettings(
    runtime,
    roomId,
    { autonomyLevel: level },
    modifiedBy
  );
}
async function getAllConfiguredGuilds(_runtime) {
  throw new Error(
    "[DJ Guild Settings] getAllConfiguredGuilds requires runtime-level component indexing support"
  );
}

// src/components/djIntroOptions.ts
import {
  createUniqueUuid as createUniqueUuid6,
  logger as logger29
} from "@elizaos/core";
var DEFAULT_DJ_INTRO_OPTIONS = {
  useLLM: true,
  style: "energetic",
  includeJokes: true,
  jokeFrequency: 20,
  includeFunFacts: true,
  includeArtistInfo: false,
  includeDedications: true,
  dedicationStyle: "heartfelt",
  introDuration: "short",
  skipIntroChance: 0,
  minTracksBetweenIntros: 0,
  templateVariety: true,
  contextWindow: 3,
  musicInfoIntegration: true,
  listenerCountIntegration: false
};
var DJ_INTRO_OPTIONS_COMPONENT_TYPE = "dj_intro_options";
var DJ_INTRO_OPTIONS_ENTITY_PREFIX = "dj-intro-options";
function getDJIntroOptionsEntityId(runtime, roomId) {
  return createUniqueUuid6(
    runtime,
    `${DJ_INTRO_OPTIONS_ENTITY_PREFIX}-${roomId}`
  );
}
async function getDJIntroOptions(runtime, roomId) {
  const entityId = getDJIntroOptionsEntityId(runtime, roomId);
  const component = await runtime.getComponent(
    entityId,
    DJ_INTRO_OPTIONS_COMPONENT_TYPE,
    void 0,
    runtime.agentId
  );
  const storedOptions = getStoredField(component, "options");
  if (!storedOptions) {
    return DEFAULT_DJ_INTRO_OPTIONS;
  }
  return {
    ...DEFAULT_DJ_INTRO_OPTIONS,
    ...storedOptions
  };
}
async function setDJIntroOptions(runtime, roomId, options) {
  try {
    const entityId = getDJIntroOptionsEntityId(runtime, roomId);
    const existingComponent = await runtime.getComponent(
      entityId,
      DJ_INTRO_OPTIONS_COMPONENT_TYPE,
      void 0,
      runtime.agentId
    );
    const storedOptions = getStoredField(
      existingComponent,
      "options"
    );
    const currentOptions = storedOptions ? { ...DEFAULT_DJ_INTRO_OPTIONS, ...storedOptions } : DEFAULT_DJ_INTRO_OPTIONS;
    const newOptions = { ...currentOptions, ...options };
    if (existingComponent) {
      await runtime.updateComponent({
        ...existingComponent,
        data: mergeStoredField(existingComponent, "options", newOptions)
      });
    } else {
      const roomContext = await requireRoomContext(
        runtime,
        roomId,
        "DJ Intro Options"
      );
      await runtime.createComponent({
        id: v4_default(),
        entityId,
        agentId: runtime.agentId,
        roomId: roomContext.roomId,
        worldId: roomContext.worldId,
        sourceEntityId: runtime.agentId,
        type: DJ_INTRO_OPTIONS_COMPONENT_TYPE,
        createdAt: Date.now(),
        data: createStoredField("options", newOptions)
      });
    }
    logger29.info(`Updated DJ intro options for room ${roomId}`);
  } catch (error) {
    logger29.error(`Error setting DJ intro options: ${error}`);
    throw error;
  }
}
async function resetDJIntroOptions(runtime, roomId) {
  await setDJIntroOptions(runtime, roomId, DEFAULT_DJ_INTRO_OPTIONS);
}
function buildIntroPrompt(options, context) {
  const {
    characterName,
    trackTitle,
    artistName,
    albumName,
    dedicatedTo,
    dedicationMessage,
    listenerCount,
    previousTracks
  } = context;
  let prompt = `You are ${characterName}, a radio DJ introducing the next song.

`;
  prompt += `Track: "${trackTitle}"`;
  if (options.includeArtistInfo && artistName) {
    prompt += ` by ${artistName}`;
  }
  if (albumName) {
    prompt += ` from the album "${albumName}"`;
  }
  prompt += "\n";
  if (options.includeDedications && dedicatedTo) {
    prompt += `
Dedication: This track is dedicated to ${dedicatedTo}`;
    if (dedicationMessage) {
      prompt += ` with the message: "${dedicationMessage}"`;
    }
    prompt += "\n";
  }
  if (options.listenerCountIntegration && listenerCount !== void 0 && listenerCount > 0) {
    prompt += `
Listeners: ${listenerCount} people tuned in right now
`;
  }
  if (options.contextWindow && previousTracks && previousTracks.length > 0) {
    const recentTracks = previousTracks.slice(-options.contextWindow);
    prompt += `
Recently played: ${recentTracks.join(", ")}
`;
  }
  prompt += `
Generate a ${options.introDuration.toUpperCase()} radio DJ introduction.

`;
  prompt += `Guidelines:
`;
  if (options.introDuration === "short") {
    prompt += `1. Keep it VERY SHORT - 10-20 seconds when spoken (20-40 words MAX)
`;
  } else if (options.introDuration === "medium") {
    prompt += `1. Keep it MODERATE - 20-40 seconds when spoken (40-80 words MAX)
`;
  } else {
    prompt += `1. Keep it DETAILED - 40-60 seconds when spoken (80-120 words MAX)
`;
  }
  const styleGuides = {
    concise: "Be brief and to-the-point",
    detailed: "Provide rich context and background",
    casual: "Sound relaxed and conversational",
    professional: "Maintain a polished, professional tone",
    energetic: "Be enthusiastic and high-energy",
    chill: "Keep it laid-back and mellow"
  };
  prompt += `2. Style: ${styleGuides[options.style]}
`;
  if (options.includeJokes && Math.random() * 100 < (options.jokeFrequency || 20)) {
    prompt += `3. Include a quick, witty joke or clever observation
`;
  }
  if (options.includeFunFacts) {
    prompt += `4. Consider adding a brief fun fact about the artist or song
`;
  }
  if (dedicatedTo && options.dedicationStyle) {
    const dedStyles = {
      brief: "Mention the dedication briefly",
      heartfelt: "Deliver the dedication with warmth",
      casual: "Casually shout out the dedication"
    };
    prompt += `5. ${dedStyles[options.dedicationStyle]}
`;
  }
  prompt += `6. NO meta-commentary - just deliver the intro naturally
`;
  prompt += `7. Sound spontaneous and conversational
`;
  if (options.personality) {
    prompt += `
Personality note: ${options.personality}
`;
  }
  prompt += `
Generate the intro now:`;
  return prompt;
}

// src/services/musicStorage.ts
import { exec } from "node:child_process";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { logger as logger30 } from "@elizaos/core";
var execAsync = promisify(exec);
var MusicStorageService = class {
  storageDir;
  highQuality;
  // Store highest quality available
  index = /* @__PURE__ */ new Map();
  // key: url
  INDEX_FILE = "storage_index.json";
  constructor(storageDir, highQuality = true) {
    this.storageDir = storageDir || join(process.cwd(), "storage", "music");
    this.highQuality = highQuality;
    if (!existsSync(this.storageDir)) {
      mkdirSync(this.storageDir, { recursive: true });
      logger30.info(`Created music storage directory: ${this.storageDir}`);
    }
    this.loadIndex();
  }
  /**
   * Check if a track is stored
   */
  isStored(url) {
    const track = this.index.get(url);
    return track ? existsSync(track.filePath) : false;
  }
  /**
   * Get stored track info
   */
  getStoredTrack(url) {
    const track = this.index.get(url);
    if (!track || !existsSync(track.filePath)) {
      return null;
    }
    return track;
  }
  /**
   * Get all stored tracks
   */
  getAllTracks() {
    return Array.from(this.index.values()).filter(
      (track) => existsSync(track.filePath)
    );
  }
  /**
   * Store a track from YouTube URL
   */
  async storeTrack(url, metadata) {
    if (this.isStored(url)) {
      const existing = this.getStoredTrack(url);
      if (existing) {
        logger30.debug(`Track already stored: ${metadata.title}`);
        return existing;
      }
    }
    logger30.info(`Storing track: ${metadata.title}`);
    const sanitize = (str) => str.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 100);
    const artist = sanitize(metadata.artist || "Unknown");
    const album = sanitize(metadata.album || "Unknown");
    const title = sanitize(metadata.title);
    const trackDir = join(this.storageDir, artist, album);
    if (!existsSync(trackDir)) {
      mkdirSync(trackDir, { recursive: true });
    }
    const filePath = join(trackDir, `${title}.webm`);
    try {
      const quality = this.highQuality ? "bestaudio" : "worstaudio";
      const command = `yt-dlp -f "${quality}" --no-playlist -o "${filePath}" "${url}"`;
      logger30.debug(`Downloading: ${command}`);
      await execAsync(command, { timeout: 3e5 });
      const stats = statSync(filePath);
      const metadata_cmd = `ffprobe -v quiet -print_format json -show_format "${filePath}"`;
      const { stdout } = await execAsync(metadata_cmd);
      const info = JSON.parse(stdout);
      const storedTrack = {
        url,
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        filePath,
        format: info.format?.format_name || "webm",
        size: stats.size,
        duration: parseFloat(info.format?.duration) || void 0,
        bitrate: parseInt(info.format?.bit_rate, 10) || void 0,
        storedAt: Date.now()
      };
      this.index.set(url, storedTrack);
      this.saveIndex();
      logger30.info(
        `Stored track: ${metadata.title} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
      );
      return storedTrack;
    } catch (error) {
      logger30.error(`Error storing track ${metadata.title}: ${error}`);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
      throw error;
    }
  }
  /**
   * Get a readable stream for a stored track
   */
  getStream(url) {
    const track = this.getStoredTrack(url);
    if (!track) {
      return null;
    }
    return createReadStream(track.filePath);
  }
  /**
   * Delete a stored track
   */
  deleteTrack(url) {
    const track = this.index.get(url);
    if (!track) {
      return false;
    }
    try {
      if (existsSync(track.filePath)) {
        unlinkSync(track.filePath);
      }
      this.index.delete(url);
      this.saveIndex();
      logger30.info(`Deleted stored track: ${track.title}`);
      return true;
    } catch (error) {
      logger30.error(`Error deleting track: ${error}`);
      return false;
    }
  }
  /**
   * Get total storage size in bytes
   */
  getTotalSize() {
    let total = 0;
    for (const track of this.index.values()) {
      if (existsSync(track.filePath)) {
        total += track.size;
      }
    }
    return total;
  }
  /**
   * Get storage statistics
   */
  getStats() {
    const tracks = this.getAllTracks();
    const byArtist = /* @__PURE__ */ new Map();
    let totalSize = 0;
    let totalDuration = 0;
    for (const track of tracks) {
      totalSize += track.size;
      totalDuration += track.duration || 0;
      const artist = track.artist || "Unknown";
      byArtist.set(artist, (byArtist.get(artist) || 0) + 1);
    }
    return {
      totalTracks: tracks.length,
      totalSize,
      totalDuration,
      byArtist
    };
  }
  /**
   * Load index from disk
   */
  loadIndex() {
    const indexPath = join(this.storageDir, this.INDEX_FILE);
    if (!existsSync(indexPath)) {
      return;
    }
    try {
      const data = readFileSync(indexPath, "utf8");
      const entries = JSON.parse(data);
      this.index = new Map(Object.entries(entries));
      logger30.debug(`Loaded ${this.index.size} tracks from storage index`);
    } catch (error) {
      logger30.error(`Error loading storage index: ${error}`);
    }
  }
  /**
   * Save index to disk
   */
  saveIndex() {
    const indexPath = join(this.storageDir, this.INDEX_FILE);
    try {
      const entries = Object.fromEntries(this.index);
      const data = JSON.stringify(entries, null, 2);
      writeFileSync(indexPath, data, "utf8");
    } catch (error) {
      logger30.error(`Error saving storage index: ${error}`);
    }
  }
};

// src/index.ts
var musicLibraryPlugin = {
  name: "music-library",
  description: "Plugin for music data storage, preferences, analytics, external APIs, smart music downloading, and YouTube functionality",
  services: [
    WikipediaService,
    MusicInfoService,
    MusicEntityDetectionService,
    WikipediaExtractionService,
    YouTubeSearchService,
    MusicLibraryService
  ],
  providers: [
    musicInfoInstructionsProvider,
    musicInfoProvider,
    wikipediaProvider,
    musicLibraryProvider_default
  ],
  actions: [
    savePlaylist_default,
    loadPlaylist_default,
    listPlaylists_default,
    deletePlaylist_default,
    searchYouTube_default,
    playMusicQuery_default,
    downloadMusic_default,
    // New: Smart download action
    addToPlaylist_default
    // New: Smart add to playlist action
  ],
  init: async (_config, _runtime) => {
    logger31.debug(
      "Music Library plugin initialized with metadata APIs, playlists, analytics, and YouTube search"
    );
  }
};
var index_default = musicLibraryPlugin;
export {
  DEFAULT_DJ_INTRO_OPTIONS,
  DEFAULT_GUILD_SETTINGS,
  MusicEntityDetectionService,
  MusicInfoService,
  MusicLibraryService,
  MusicStorageService,
  SpotifyClient,
  WikipediaExtractionService,
  WikipediaService,
  YouTubeSearchService,
  addSongToLibrary,
  buildIntroPrompt,
  index_default as default,
  deletePlaylist,
  getAllConfiguredGuilds,
  getAnalytics,
  getDJGuildSettings,
  getDJIntroOptions,
  getDJTipStats,
  getLastPlayedSong,
  getLibraryStats,
  getMostPlayedSongs,
  getMostRequestedSongs,
  getRecentSongs,
  getRecentTips,
  getRoomPreferences,
  getSong,
  getSongMemory,
  getTopSongs,
  getTopTippers,
  getUserPreferences,
  loadPlaylists,
  recordSongDedication,
  recordSongPlay,
  recordSongRequest,
  repetitionControl,
  resetDJGuildSettings,
  resetDJIntroOptions,
  savePlaylist,
  searchLibrary,
  setAutonomyLevel,
  setDJGuildSettings,
  setDJIntroOptions,
  toggleDJ,
  trackDJTip,
  trackFavorite,
  trackListenerSnapshot,
  trackSession,
  trackSkip,
  trackTrackPlayed,
  trackTrackRequest,
  updateUserPreferences
};
//# sourceMappingURL=index.js.map