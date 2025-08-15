import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 
import "../styles/mainpage.css";
import "../styles/UploadPage.css";

import house from "../image/house.png";
import search from "../image/search.png";
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import uploadImg from "../image/image32.png";

export const TagGroup = () => (
  <div className="tag-group">
    <div className="tag tag-outline" style={{ transform: "rotate(-6.33deg)" }}>
      short_term
    </div>
    <div className="tag tag-outline-white" style={{ transform: "rotate(2.37deg)" }}>
      to long-term
    </div>
    <div className="tag tag-filled" style={{ transform: "rotate(-5.35deg)" }}>
      rentals!
    </div>
  </div>
);

// 백엔드 베이스 URL (.env에 REACT_APP_API_BASE 설정 가능)
const API_BASE = process.env.REACT_APP_API_BASE ?? "http://localhost:5000";

const UploadPage = () => {
  const navigate = useNavigate();

  // 이미지 업로드
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // 현재 탭: transfer | lodging
  const [activeTab, setActiveTab] = useState("transfer");

  // 탭별 폼 (완전 분리)
  const [forms, setForms] = useState({
    transfer: {
      building: "",
      content: "",
      pin: "",
      address: "",
      price: "",
      period: "",
    },
    lodging: {
      building: "",
      content: "",
      pin: "",
      date: "",
      people: "",
      amount: "",
      address: "",
    },
  });

  const form = forms[activeTab];

  // 공통 폼 변경
  const onFormChange = (field) => (e) => {
    const value = e.target.value;
    setForms((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  // 이미지 처리
  const onPickImage = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 업로드(목업)
  const onUpload = () => {
    const payload = { type: activeTab, ...forms[activeTab] };
    console.log("upload payload:", payload);
    alert("업로드 완료(목업)!");
  };

  // ===== AI 글쓰기: 현재 탭의 content만 서버로 보내서 대체 =====
  const [aiBusy, setAiBusy] = useState(false);

  async function postJSON(path, body) {
    const resp = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const msg = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText} - ${msg}`);
    }
    return resp.json();
  }

  const onAiRewrite = async () => {
    const content = forms[activeTab].content ?? "";
    if (!content.trim()) {
      alert("본문이 비어 있어요. 먼저 내용을 입력해 주세요.");
      return;
    }
    setAiBusy(true);
    try {
      // 백엔드 스펙에 맞춰 path/키를 수정하세요.
      // 예: POST /ai/rewrite  -> { content: "...", type: "transfer"|"lodging" }
      const data = await postJSON("/ai/rewrite", {
        type: activeTab,
        content,
      });

      // 응답 키가 'content'라고 가정 (다르면 여기만 바꾸면 됨)
      const improved = data?.content ?? "";
      setForms((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], content: improved },
      }));
    } catch (e) {
      console.error(e);
      alert("AI 글쓰기 실패: " + e.message);
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="screen upload-page">
      <div className="container">
        <div
          className="search-button"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/search")}
        >
          <div className="search-label">Let’s search!</div>
        </div>
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />
       {/* 공용 헤더 */}
              <Header />
        <div className="header">
          <h1 className="main-title">
            FIT ROOM
            <br />_Finding <br /> a house that suits me
          </h1>
          <img src={house} alt="house" className="house-image" />
        </div>

        <div className="category-wrapper">
          <div className="category-card" onClick={() => navigate("/lodging")}>
            <img src={lodgingImg} alt="숙박" className="category-image" />
            <div className="category-label">숙박</div>
          </div>
          <div className="category-card" onClick={() => navigate("/transfer")}>
            <img src={transferImg} alt="양도" className="category-image" />
            <div className="category-label">양도</div>
          </div>
          <div className="category-card active">
            <img src={uploadImg} alt="업로드" className="category-image" />
            <div className="category-label">업로드</div>
          </div>
        </div>

        {/* 요약/태그 */}
        <div className="summary-box">
          <div className="summary-check">Check out</div>
          <p className="summary-text">your home at a glance,</p>
        </div>
        <TagGroup />

        <section className="upload-inner">
          {/* 탭 버튼: 두 개만 */}
          <div className="upload-tabs">
            <button
              type="button"
              className={`tab ${activeTab === "transfer" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setActiveTab("transfer")}
              aria-pressed={activeTab === "transfer"}
            >
              양도
            </button>

            <button
              type="button"
              className={`tab ${activeTab === "lodging" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setActiveTab("lodging")}
              aria-pressed={activeTab === "lodging"}
            >
              숙박
            </button>
          </div>

          <div className="upload-grid">
            {/* 좌: 이미지 카드 */}
            <div className="upload-card" onClick={onPickImage} role="button" tabIndex={0}>
              <div className="upload-card__shadow shadow--1" />
              <div className="upload-card__shadow shadow--2" />
              <div className="upload-card__body">
                {preview ? (
                  <img src={preview} alt="preview" className="upload-preview" />
                ) : (
                  <span className="plus">+</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  hidden
                />
              </div>
            </div>

            {/* 우: 폼 */}
            <div className="upload-form">
              {/* 제목 */}
              <div className="title-line">
                <input
                  className="title-input"
                  placeholder="건물명"
                  value={form.building}
                  onChange={onFormChange("building")}
                />
                <div className="underline" />
              </div>

              {/* 칩 영역 */}
              <div className={`chips ${activeTab === "lodging" ? "is-lodging" : "is-transfer"}`}>
                {activeTab === "lodging" ? (
                  <>
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="날짜 (예: 11.2 ~ 11.5)"
                      value={form.date}
                      onChange={onFormChange("date")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="인원수 (예: 2명)"
                      value={form.people}
                      onChange={onFormChange("people")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="금액 (예: 50만원)"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.amount}
                      onChange={onFormChange("amount")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="주소"
                      value={form.address}
                      onChange={onFormChange("address")}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="주소"
                      value={form.address}
                      onChange={onFormChange("address")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="가격 (예: 150만원)"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.price}
                      onChange={onFormChange("price")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="기간 (예: 바로입주 / 11.2~11.5)"
                      value={form.period}
                      onChange={onFormChange("period")}
                    />
                  </>
                )}
              </div>

              {/* 요약 라인 */}
              <div className="summary summary--form">
                {activeTab === "lodging"
                  ? form.date || form.people || form.amount || form.address
                    ? `${form.date || ""} / ${form.people || ""} / ${form.amount || ""} / ${form.address || ""}`
                    : "11.2~11.5 / 2명 / 50만원 / ○○빌라"
                  : form.address || form.price || form.period
                    ? `${form.address || ""} / ${form.price || ""} / ${form.period || ""}`
                    : "○○빌라 / 150만원 / 바로입주"}
              </div>

              {/* 본문 */}
              <div className="editor">
                <textarea
                  className="editor-area"
                  value={form.content}
                  onChange={onFormChange("content")}
                  placeholder="글쓰기 / 고객과의 컨택을 위한 연락처를 남겨주세요!"
                />
              </div>

              {/* 하단: PIN + 업로드 + AI 글쓰기 */}
              <div className="bottom-actions">
                <div className="pin-wrap">
                  <label className="pin-label">PIN</label>
                  <input
                    className="pin-input"
                    value={form.pin}
                    onChange={onFormChange("pin")}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>

                <button className="upload-btn" onClick={onUpload}>
                  업로드
                </button>

                <button className="upload-btn" onClick={onAiRewrite} disabled={aiBusy}>
                  {aiBusy ? "AI 처리 중..." : "AI 글쓰기"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="footer-text">
          FIT ROOM
          <br />
          <span className="footer-sub">
            _Finding
            <br /> a house that suits me
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
