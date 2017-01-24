'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _quinoaVisModules = require('quinoa-vis-modules');

var _PresentationLayout = require('./PresentationLayout');

var _PresentationLayout2 = _interopRequireDefault(_PresentationLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import validate from './presentationValidator';

require('./Player.scss');

var QuinoaPresentationPlayer = function (_Component) {
  _inherits(QuinoaPresentationPlayer, _Component);

  function QuinoaPresentationPlayer(props) {
    _classCallCheck(this, QuinoaPresentationPlayer);

    var _this = _possibleConstructorReturn(this, (QuinoaPresentationPlayer.__proto__ || Object.getPrototypeOf(QuinoaPresentationPlayer)).call(this, props));

    _this.initPresentation = _this.initPresentation.bind(_this);
    _this.renderComponent = _this.renderComponent.bind(_this);

    _this.setCurrentSlide = _this.setCurrentSlide.bind(_this);
    _this.stepSlide = _this.stepSlide.bind(_this);
    _this.toggleAside = _this.toggleAside.bind(_this);
    _this.resetView = _this.resetView.bind(_this);
    _this.onUserViewChange = _this.onUserViewChange.bind(_this);

    var initialState = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false
      },
      datasets: {},
      activeViewsParameters: {}
    };

    if (props.presentation) {
      // const valid = validate(props.presentation);
      // console.log(valid);
      // if (valid) {
      initialState.status = 'loaded';
      initialState.presentation = props.presentation;
      // }
      // else {
      // initialState.status = 'error';
      // }
    }

    _this.state = initialState;
    return _this;
  }

  _createClass(QuinoaPresentationPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.presentation) {
        this.setCurrentSlide(this.state.presentation.order[0]);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _this2 = this;

      var slide = nextState.currentSlide;
      var previousSlide = this.state.currentSlide;

      var slideParamsMark = slide && Object.keys(slide.views).map(function (viewKey) {
        return slide.views[viewKey] && slide.views[viewKey].viewParameters && slide.views[viewKey].viewParameters.viewDataMap;
      });
      var previousSlideParamsMark = previousSlide && Object.keys(previousSlide.views).map(function (viewKey) {
        return previousSlide.views[viewKey] && previousSlide.views[viewKey].viewParameters && previousSlide.views[viewKey].viewParameters.viewDataMap;
      });
      if (JSON.stringify(slideParamsMark) !== JSON.stringify(previousSlideParamsMark)) {
        (function () {
          var datasets = {};
          Object.keys(slide.views).map(function (viewKey) {
            var viewDataMap = slide.views[viewKey].viewDataMap;
            var visualization = _this2.state.presentation.visualizations[viewKey];
            var visType = visualization.metadata.visualizationType;
            var dataset = _this2.state.presentation.datasets[visualization.datasets[0]];
            dataset = dataset && dataset.data;
            var mappedData = void 0;
            switch (visType) {
              case 'map':
                mappedData = (0, _quinoaVisModules.mapMapData)(dataset, viewDataMap);
                break;
              case 'timeline':
                mappedData = (0, _quinoaVisModules.mapTimelineData)(dataset, viewDataMap);
                break;
              case 'network':
                mappedData = (0, _quinoaVisModules.mapNetworkData)(dataset, viewDataMap);
                break;
              default:
                break;
            }
            datasets[viewKey] = mappedData;
          });
          _this2.setState({
            datasets: datasets
          });
        })();
      }
      var slideViewParamsMark = previousSlide && Object.keys(previousSlide.views).map(function (viewKey) {
        return previousSlide.views[viewKey];
      });
      var activeViewParamsMark = Object.keys(slide.views).map(function (viewKey) {
        return _this2.state.activeViewsParameters[viewKey];
      });
      if (previousSlide && JSON.stringify(slideViewParamsMark) !== JSON.stringify(activeViewParamsMark) && !this.state.viewDifferentFromSlide) {
        this.setState({
          viewDifferentFromSlide: true
        });
      }
    }
  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(viewKey, viewParameters) {
      this.setState({
        activeViewsParameters: _extends({}, this.state.activeViews, _defineProperty({}, viewKey, { viewParameters: viewParameters }))
      });
    }
  }, {
    key: 'resetView',
    value: function resetView() {
      var slide = this.state.currentSlide;
      if (slide) {
        var activeViewsParameters = Object.keys(slide.views).reduce(function (result, viewKey) {
          return _extends({}, result, _defineProperty({}, viewKey, { viewParameters: slide.views[viewKey].viewParameters }));
        }, {});
        this.setState({
          activeViewsParameters: activeViewsParameters,
          viewDifferentFromSlide: false
        });
      }
    }
  }, {
    key: 'initPresentation',
    value: function initPresentation(presentation) {
      // const valid = validate(presentation);
      // if (valid) {
      this.setState({
        status: 'loaded',
        presentation: presentation
      });
      //    }
      // else {
      //      this.setState({
      //        status: 'error'
      //      });
      //    }
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      var _props$options = this.props.options,
          options = _props$options === undefined ? {} : _props$options;

      if (this.state.presentation && this.state.status === 'loaded') {
        return _react2.default.createElement(_PresentationLayout2.default, {
          currentSlide: this.state.currentSlide,
          activeViewsParameters: this.state.activeViewsParameters,
          viewDifferentFromSlide: this.state.viewDifferentFromSlide,
          datasets: this.state.datasets,
          presentation: this.state.presentation,
          navigation: this.state.navigation,
          setCurrentSlide: this.setCurrentSlide,
          stepSlide: this.stepSlide,
          toggleAside: this.toggleAside,
          gui: this.state.gui,
          options: options,
          resetView: this.resetView,
          onUserViewChange: this.onUserViewChange });
      } else if (this.status === 'error') {
        return _react2.default.createElement(
          'div',
          null,
          'Oups, that looks like an error'
        );
      } else {
        return _react2.default.createElement(
          'div',
          null,
          'No data yet'
        );
      }
    }
  }, {
    key: 'setCurrentSlide',
    value: function setCurrentSlide(id) {
      var slide = this.state.presentation.slides[id];
      if (slide) {
        var activeViewsParameters = Object.keys(slide.views).reduce(function (result, viewKey) {
          return _extends({}, result, _defineProperty({}, viewKey, { viewParameters: slide.views[viewKey].viewParameters }));
        }, {});
        this.setState({
          currentSlide: slide,
          viewDifferentFromSlide: false,
          activeViewsParameters: activeViewsParameters,
          navigation: _extends({}, this.state.navigation, {
            currentSlideId: id,
            position: this.state.presentation.order.indexOf(id),
            firstSlide: this.state.navigation.position === 0,
            lastSlide: this.state.navigation.position === this.state.presentation.order.length - 1
          })
        });
        if (this.props.onSlideChange) {
          this.props.onSlideChange(id);
        }
      }
    }
  }, {
    key: 'stepSlide',
    value: function stepSlide(forward) {
      var newSlidePosition = void 0;
      if (forward) {
        newSlidePosition = this.state.navigation.position < this.state.presentation.order.length - 1 ? this.state.navigation.position + 1 : 0;
      } else {
        newSlidePosition = this.state.navigation.position > 0 ? this.state.navigation.position - 1 : this.state.presentation.order.length - 1;
      }
      this.setCurrentSlide(this.state.presentation.order[newSlidePosition]);
    }
  }, {
    key: 'toggleAside',
    value: function toggleAside() {
      this.setState({
        gui: _extends({}, this.state.gui, {
          asideVisible: !this.state.gui.asideVisible
        })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'quinoa-presentation-player' },
        this.renderComponent()
      );
    }
  }]);

  return QuinoaPresentationPlayer;
}(_react.Component);

QuinoaPresentationPlayer.propTypes = {
  // presentation: PropTypes.Object,
  options: _react.PropTypes.shape({
    allowViewExploration: _react.PropTypes.bool // whether users can pan/zoom/navigate inside view
  }),
  onSlideChange: _react.PropTypes.func };

exports.default = QuinoaPresentationPlayer;