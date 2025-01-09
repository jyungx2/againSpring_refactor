import PropTypes from "prop-types";

ErrorMsg.propTypes = {
  target: PropTypes.object,
};

function ErrorMsg({ target }) {
  if (!target) return;
  return <p className="text-error text-[14px] pl-2">{target.message}</p>;
}

export default ErrorMsg;
