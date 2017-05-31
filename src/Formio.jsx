import React from 'react';
import PropTypes from 'prop-types';
import { FormioFactory } from 'formiojs/factory';

export class Formio extends React.Component {
  static defaultProps = {
    options: {}
  };

  static propTypes = {
    src: PropTypes.string,
    form: PropTypes.object,
    submission: PropTypes.object,
    options: PropTypes.shape({
      readOnly: PropTypes.boolean,
      noAlerts: PropTypes.boolean,
      i18n: PropTypes.string,
      template: PropTypes.string
    }),
    onPrevPage: PropTypes.func,
    onNextPage: PropTypes.func,
    onChange: PropTypes.func,
    onCustomEvent: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitDone: PropTypes.func,
    onError: PropTypes.func,
    onRender: PropTypes.func
  };

  componentDidMount = () => {
    const { options, src, form } = this.props;

    if (src) {
      this.createPromise = FormioFactory.createForm(this.element, src, options).then(formio => this.formio = formio);
    }
    if (form) {
      this.createPromise = FormioFactory.createForm(this.element, form, options).then(formio => this.formio = formio);
    }

    this.initializeFormio();
  };

  initializeFormio = () => {
    const { submission } = this.props;

    if (this.createPromise) {
      this.createPromise.then(() => {
        if (submission) {
          this.formio.submission = submission;
        }
        this.formio.on('prevPage', this.emit('onPrevPage'));
        this.formio.on('nextPage', this.emit('onNextPage'));
        this.formio.on('change', this.emit('onChange'));
        this.formio.on('customEvent', this.emit('onCustomEvent'));
        this.formio.on('submit', this.emit('onSubmit'));
        this.formio.on('submitDone', this.emit('onSubmitDone'));
        this.formio.on('error', this.emit('onError'));
        this.formio.on('render', this.emit('onRender'));
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { options, src, form, submission } = this.props;

    if (src !== nextProps.src) {
      this.createPromise = FormioFactory.createForm(this.element, nextProps.src, options).then(formio => this.formio = formio);
      this.initializeFormio();
    }
    if (form !== nextProps.form) {
      this.createPromise = FormioFactory.createForm(this.element, nextProps.form, options).then(formio => this.formio = formio);
      this.initializeFormio();
    }

    if (submission !== nextProps.submission) {
      this.formio.submission = nextProps.submission;
    }
  };

  render = () => {
    return <div ref={element => this.element = element} />;
  };

  emit = (funcName) => {
    return (...args) => {
      if (this.props.hasOwnProperty(funcName) && typeof (this.props[funcName]) === 'function') {
        this.props[funcName](...args);
      }
    }
  };
}
