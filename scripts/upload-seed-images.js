// scripts/upload-seed-images.js
import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import FormData from "form-data";

const ORIGIN = "https://fesp-api.koyeb.app/market";
const UPLOAD_DIR = "./againSpring/uploadFiles"; // 시드 이미지 폴더
const DATA_JS = "./againSpring/data.js"; // data.js 파일 경로

async function uploadFile(filePath, fileName) {
  const fd = new FormData();
  fd.append("files", fs.createReadStream(filePath), fileName);

  const res = await fetch(`${ORIGIN}/files`, { method: "POST", body: fd });
  const json = await res.json();
  if (!json.ok) throw new Error(JSON.stringify(json));
  return json.item[0].path; // Cloudinary URL
}

(async () => {
  const files = fs
    .readdirSync(UPLOAD_DIR)
    .filter((f) => fs.statSync(path.join(UPLOAD_DIR, f)).isFile());
  const map = {}; // { filename: cloudinaryUrl }

  for (const f of files) {
    const abs = path.join(UPLOAD_DIR, f);
    const url = await uploadFile(abs, f);
    map[f] = url;
    console.log("✅ 업로드:", f, "→", url);
  }

  // data.js 업데이트
  let code = fs.readFileSync(DATA_JS, "utf8");
  for (const [fname, url] of Object.entries(map)) {
    // 기존 파일명이 들어간 경로를 절대 URL로 치환
    const regex = new RegExp(`(["'\`])[^"'\`]*${fname}(["'\`])`, "g");
    code = code.replace(regex, `"${url}"`);
  }
  fs.writeFileSync(DATA_JS, code, "utf8");
  console.log("🎉 data.js 업데이트 완료");
})();
