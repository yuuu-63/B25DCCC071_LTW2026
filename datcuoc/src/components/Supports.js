const Supports = ({ status, used, insuredNow, onPreview, onInsure, onHint }) => {
  const betting = status === 'betting';
  const answering = status === 'answering';

  let insureLabel = 'Bảo hiểm';
  if (insuredNow) insureLabel = 'Đã bảo hiểm';
  else if (used.insurance) insureLabel = 'Bảo hiểm (đã dùng)';

  return (
    <div className="supports">
      <button disabled={!betting || used.preview} onClick={onPreview}>
        Xem trước
      </button>
      <button
        disabled={!(betting || answering) || used.insurance}
        onClick={onInsure}
      >
        {insureLabel}
      </button>
      <button disabled={!answering || used.hint} onClick={onHint}>
        Gợi ý
      </button>
    </div>
  );
};

export default Supports;