import { useState } from 'react'
import { ReportForm } from '../components/ReportForm'
import { reportConfig } from '../config/reportConfig'

function createQrImageSrc() {
  if (typeof window === 'undefined') {
    return ''
  }

  const origin = window.location.origin + window.location.pathname + '#report-form'
  const encoded = encodeURIComponent(origin)
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`
}

export function LandingPage() {
  const qrImageSrc = createQrImageSrc()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  const hotlinePhone = reportConfig.integrations.hotlinePhone

  const scrollToForm = () => {
    document.getElementById('report-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
    <main className="landing-page">
      <section className="hero-card">
        <p className="eyebrow">Kênh phản ánh an toàn</p>
        <h1>Phản ánh bạo lực học đường nhanh và bảo mật</h1>
        <p className="hero-description">
          Nhà trường tiếp nhận thông tin theo thời gian thực để hỗ trợ kịp thời. Bạn có thể phản ánh
          ẩn danh qua form dưới đây.
        </p>

        <div className="hero-actions">
          <button type="button" onClick={scrollToForm}>
            Gửi phản ánh
          </button>
          <button type="button" className="btn-emergency" onClick={() => setIsContactModalOpen(true)}>
            Liên hệ khẩn cấp
          </button>
        </div>
      </section>

      <section className="qr-card" aria-label="Mã QR truy cập nhanh">
        <h2>Quét mã QR để truy cập nhanh</h2>
        {qrImageSrc ? (
          <img src={qrImageSrc} alt="QR dẫn tới form phản ánh" width={220} height={220} />
        ) : (
          <p>QR sẽ hiển thị khi chạy trên trình duyệt.</p>
        )}
      </section>

      <section className="form-card" aria-label="Biểu mẫu phản ánh">
        <ReportForm />
      </section>

      <section className="media-section" aria-label="Tài liệu tham khảo">
        <h2>Tài liệu giáo dục & Truyền thông</h2>
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/NT9c1fCXsLo"
            title="5.8  Chủ đề Phòng chống bạo lực học đường"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <div className="article-container">
          <iframe
            src={reportConfig.integrations.articleIframeUrl}
            title="Bạo lực học đường"
          ></iframe>
          <div className="article-fallback" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <a href={reportConfig.integrations.articleOriginalUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', textDecoration: 'none', borderRadius: '4px' }}>
              Đọc bài báo gốc
            </a>
          </div>
        </div>
      </section>

      {isContactModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsContactModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsContactModalOpen(false)}>✕</button>
            <h3>Liên hệ bộ phận trực đường dây nóng</h3>
            <p>Vui lòng chọn hình thức liên hệ phù hợp với bạn:</p>
            <div className="modal-options">
               <a href={`tel:${hotlinePhone}`} className="modal-btn-phone">
                  📞 Gọi điện trực tiếp ({hotlinePhone})
               </a>
               <a href={`https://zalo.me/${hotlinePhone}`} target="_blank" rel="noreferrer" className="modal-btn-zalo">
                  💬 Nhắn tin qua Zalo
               </a>
            </div>
          </div>
        </div>
      )}
    </main>
    <footer className="app-footer">
      <p>
        © Kênh phản ánh an toàn, đảm bảo ẩn danh thông tin người báo. Được tạo ra bởi Trịnh Quang Trung.
      </p>
    </footer>
    </>
  )
}
