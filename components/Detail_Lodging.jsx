import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import house from "../image/house.png";
import "../styles/Detail_Lodging.css";

const DetailLodging = () => {
  const navigate = useNavigate();       // ✅ 컴포넌트 최상위에서 호출
  const { state } = useLocation();      // LodgingPage에서 넘긴 { img, summary }

  if (!state) {
    return (
      <div style={{ padding: 24 }}>
        잘못된 접근입니다.{" "}
        <button onClick={() => navigate("/lodging")}>숙박 목록으로</button>
      </div>
    );
  }


    return (
    <div className="detail-lodging">
      <div className="container">
        <div className="header">
          <div className="branding">
            <p className="branding-text">
              FIT ROOM<br />_Finding<br />a house that suits me
            </p>
            <img
              className="house-icon"
              src={house}
              alt="house"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="controls">
            <button className="search-top-btn" onClick={() => navigate("/")}>
              Let’s search!
            </button> 
          </div>
        </div>
        {/* ===== 상세 상단 탭 ===== */}
<div className="detail-tabs">
  <button className="pill pill--black">숙박</button>
</div>

{/* ===== 사진 + 상세 그리드 ===== */}
<section className="detail-grid">
  {/* 좌측: 사진 카드 */}
  <div className="photo-card">
    <div className="pc-shadow s1" />
    <div className="pc-shadow s2" />
    <div className="pc-body">
      <img
        src={state?.img}
        alt="숙박 이미지"
        className="pc-img"
      />
    </div>
  </div>

  {/* 우측: 텍스트 상세 */}
  <div className="detail-info">
    <h3 className="di-title">ㅇㅇ빌라 숙박</h3>
    <div className="di-hr" />
    <div className="di-meta">{state?.summary || "11.13~11.15 / 2명 / 30000w"}</div>
    <div className="di-body">
    <p className="di-desc">
      N명까지 가능합니다 침구 N개 있어요.<br />
      편의점도 도보 2분 거리에 있어요<br />
      oooo@ooo.com
    </p>

    <div className="di-actions">
      <button className="chip chip--ghost">수정</button>
      <button className="chip chip--ghost">삭제</button>
    </div>
  </div>
  </div>
</section>
        <footer className="footer">
          <p>
            FIT ROOM<br />
            <span className="footer-sub">_Finding a house that suits me</span>
          </p>
        </footer>
      </div>

</div>    
  );
};

export default DetailLodging;  