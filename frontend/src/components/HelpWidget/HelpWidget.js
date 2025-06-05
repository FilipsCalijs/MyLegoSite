import React, { useState } from "react";
import HelpForm from "../HelpForm";


import "./HelpWidget.css"; // Обязательно подключи этот CSS!

function HelpWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Кнопка справа внизу */}
      <button
        className="help-widget-btn"
        onClick={() => setOpen(true)}
        aria-label="Help"
      >
        <span role="img" aria-label="Help">💬</span> Help
      </button>
      {/* Модальное окно */}
      {open && (
        <div className="help-modal-bg" onClick={() => setOpen(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <div className="help-modal-header">
              <strong>Help</strong>
              <button className="help-modal-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <HelpForm />
          </div>
        </div>
      )}
    </>
  );
}

export default HelpWidget;
