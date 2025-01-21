import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "quill/dist/quill.snow.css";

import { QUILL_FORMATS, QUILL_MODULES } from "@constants/editorConfig";
import { handleImageUpload } from "@utils/imageUpload";
import PostForm from "@components/PostForm";
import usePostEditor from "@hooks/usePostEditor";
import useProductModal from "@hooks/useProductModal";

/**
 * QnA 전용 에디터 컴포넌트
 */
function QnAPostEditor({
  quillRef,
  title,
  setTitle,
  isEdit,
  isLoading,
  selectedProduct,
  setSelectedProduct,
  handleSave,
  handleCancel,
}) {
  const {
    isModalOpen,
    openModal,
    closeModal,
    handleProductSelect,
    handleProductRemove,
    error,
  } = useProductModal({
    selectedProduct,
    setSelectedProduct,
  });

  return (
    <PostForm
      type='qna'
      isEdit={isEdit}
      title={title}
      setTitle={setTitle}
      quillRef={quillRef}
      selectedProduct={selectedProduct}
      isProductPost={true}
      isModalOpen={isModalOpen}
      isLoading={isLoading}
      openModal={openModal}
      closeModal={closeModal}
      handleProductSelect={handleProductSelect}
      handleProductRemove={handleProductRemove}
      handleSave={handleSave}
      handleCancel={handleCancel}
      error={error}
    />
  );
}

QnAPostEditor.propTypes = {
  quillRef: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  selectedProduct: PropTypes.object,
  setSelectedProduct: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

/**
 * Notice 전용 에디터 컴포넌트
 */
function NoticePostEditor({
  quillRef,
  title,
  setTitle,
  isEdit,
  isLoading,
  handleSave,
  handleCancel,
}) {
  return (
    <PostForm
      type='notice'
      isEdit={isEdit}
      title={title}
      setTitle={setTitle}
      quillRef={quillRef}
      isLoading={isLoading}
      handleSave={handleSave}
      handleCancel={handleCancel}
    />
  );
}

NoticePostEditor.propTypes = {
  quillRef: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

/**
 * 메인 PostEditor 컴포넌트
 */
export default function PostEditor({ type, isEdit }) {
  const { id } = useParams();
  const returnPath = isEdit ? `/${type}/detail/${id}` : `/${type}`;

  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
    placeholder: "내용을 입력해주세요.",
  });

  const {
    title,
    setTitle,
    isLoading,
    setQuillInstance,
    selectedProduct,
    setSelectedProduct,
    handleSave,
    handleCancel,
  } = usePostEditor({
    type,
    isEdit,
    post: isEdit ? { _id: id } : null,
    returnPath,
  });

  /**
   * Quill 에디터 초기화 및 이미지 핸들러 설정
   * 에디터가 마운트되면 이미지 업로드 핸들러를 추가
   */
  useEffect(() => {
    if (quill) {
      setQuillInstance(quill);
      quill
        .getModule("toolbar")
        .addHandler("image", () => handleImageUpload(quill));
    }
  }, [quill, setQuillInstance]);

  /**
   * 게시글 타입에 따른 에디터 컴포넌트를 렌더링하는 함수
   * @returns {JSX.Element} 타입별 에디터 컴포넌트
   * @throws {Error} 지원하지 않는 게시글 타입일 경우
   */
  const renderEditor = () => {
    const commonProps = {
      quillRef,
      title,
      setTitle,
      isEdit,
      isLoading,
      handleSave,
      handleCancel,
    };

    switch (type) {
      case "qna":
        return (
          <QnAPostEditor
            {...commonProps}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        );
      case "notice":
        return <NoticePostEditor {...commonProps} />;
      default:
        throw new Error(`Unsupported post type: ${type}`);
    }
  };

  return renderEditor();
}

PostEditor.propTypes = {
  type: PropTypes.oneOf(["notice", "qna"]).isRequired,
  isEdit: PropTypes.bool.isRequired,
};
