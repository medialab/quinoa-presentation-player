'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _StepperLayout = require('./templates/stepper/StepperLayout');

var _StepperLayout2 = _interopRequireDefault(_StepperLayout);

var _ScrollerLayout = require('./templates/scroller/ScrollerLayout');

var _ScrollerLayout2 = _interopRequireDefault(_ScrollerLayout);

var _quinoaVisModules = require('quinoa-vis-modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 


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
    _this.toggleInteractionMode = _this.toggleInteractionMode.bind(_this);
    _this.onExit = _this.onExit.bind(_this);

    var initialState = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false,
        interactionMode: 'read'
      },
      datasets: {},
      activeViewsParameters: {}
    };
    if (props.presentation) {
      initialState.status = 'loaded';
      initialState.presentation = props.presentation;
    }

    _this.state = initialState;
    return _this;
  }


  _createClass(QuinoaPresentationPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.presentation) {
        if (this.state.presentation.order && this.state.presentation.order.length) {
          var beginAt = this.props.beginAt && this.props.beginAt < this.state.presentation.order.length ? this.props.beginAt : 0;
          this.setCurrentSlide(this.state.presentation.order[beginAt]);
        }
        var datasets = {};
        var views = this.state.presentation.visualizations;
        Object.keys(views).map(function (viewKey) {
          var view = views[viewKey];
          var visualization = _this2.state.presentation.visualizations[viewKey];
          var visType = visualization.metadata.visualizationType;
          var dataset = visualization.data;
          var mappedData = void 0;
          switch (visType) {
            case 'map':
              mappedData = (0, _quinoaVisModules.mapMapData)(dataset, view.flattenedDataMap);
              break;
            case 'timeline':
              mappedData = (0, _quinoaVisModules.mapTimelineData)(dataset, view.flattenedDataMap);
              break;
            case 'network':
              mappedData = (0, _quinoaVisModules.mapNetworkData)(dataset, view.flattenedDataMap);
              break;
            default:
              break;
          }
          datasets[viewKey] = mappedData;
        });
        this.setState({
          activeViewsParameters: _extends({}, this.state.presentation.visualizations),
          datasets: datasets
        });
      }
    }

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.presentation !== nextProps.presentation) {
        this.setState({ presentation: nextProps.presentation });
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
      var _this3 = this;

      var slide = nextState.currentSlide;
      var previousSlide = this.state.currentSlide;
      var slideParamsMark = slide && Object.keys(slide.views).map(function (viewKey) {
        return slide.views[viewKey] && slide.views[viewKey].viewParameters && slide.views[viewKey].viewParameters.flattenedDataMap;
      });
      var previousSlideParamsMark = previousSlide && Object.keys(previousSlide.views).map(function (viewKey) {
        return previousSlide.views[viewKey] && previousSlide.views[viewKey].viewParameters && previousSlide.views[viewKey].viewParameters.flattenedDataMap;
      });
      if (JSON.stringify(slideParamsMark) !== JSON.stringify(previousSlideParamsMark)) {
        var datasets = {};
        var views = slide ? slide.views : nextState.presentation.visualizations;
        Object.keys(views).map(function (viewKey) {
          var view = views[viewKey];
          var viewDataMap = Object.keys(view.viewParameters.dataMap).reduce(function (result, collectionId) {
            return _extends({}, result, _defineProperty({}, collectionId, Object.keys(view.viewParameters.dataMap[collectionId]).reduce(function (propsMap, parameterId) {
              var parameter = view.viewParameters.dataMap[collectionId][parameterId];
              if (parameter.mappedField) {
                return _extends({}, propsMap, _defineProperty({}, parameterId, parameter.mappedField));
              }
              return propsMap;
            }, {})));
          }, {});
          var visualization = _this3.state.presentation.visualizations[viewKey];
          var visType = visualization.metadata.visualizationType;
          var dataset = visualization.data;
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
            case 'svg':
              mappedData = dataset;
              break;
            default:
              break;
          }
          datasets[viewKey] = mappedData;
        }); 
        this.setState({
          datasets: datasets
        });
      }
      var slideViewParamsMark = previousSlide && Object.keys(previousSlide.views).map(function (viewKey) {
        return previousSlide.views[viewKey];
      });
      var activeViewParamsMark = slide && Object.keys(slide.views).map(function (viewKey) {
        return _this3.state.activeViewsParameters[viewKey];
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
      } else {
        var visualizations = this.state.presentation.visualizations;
        var _activeViewsParameters = Object.keys(visualizations).reduce(function (result, viewKey) {
          return _extends({}, result, _defineProperty({}, viewKey, { viewParameters: visualizations[viewKey].viewParameters }));
        }, {});
        this.setState({
          activeViewsParameters: _activeViewsParameters,
          viewDifferentFromSlide: false
        });
      }
    }

  }, {
    key: 'initPresentation',
    value: function initPresentation(presentation) {
      this.setState({
        status: 'loaded',
        presentation: presentation
      });
    }

  }, {
    key: 'toggleInteractionMode',
    value: function toggleInteractionMode(to) {
      this.setState({
        gui: _extends({}, this.state.gui, {
          interactionMode: to
        })
      });
    }

  }, {
    key: 'onExit',
    value: function onExit(side) {
      if (typeof this.props.onExit === 'function') {
        this.props.onExit(side);
      }
    }

  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      var _props = this.props,
          _props$options = _props.options,
          options = _props$options === undefined ? {} : _props$options,
          template = _props.template;

      if (this.state.presentation && this.state.status === 'loaded') {
        var activeTemplate = this.state.presentation && this.state.presentation.settings && this.state.presentation.settings.template || template || 'stepper';
        switch (activeTemplate) {
          case 'scroller':
            return _react2.default.createElement(_ScrollerLayout2.default, {
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
              onUserViewChange: this.onUserViewChange,
              toggleInteractionMode: this.toggleInteractionMode,
              onExit: this.onExit });
          case 'stepper':
          default:
            return _react2.default.createElement(_StepperLayout2.default, {
              activeViewsParameters: this.state.activeViewsParameters,
              currentSlide: this.state.currentSlide,
              datasets: this.state.datasets,
              gui: this.state.gui,
              navigation: this.state.navigation,
              onExit: this.onExit,
              onUserViewChange: this.onUserViewChange,
              options: options,
              presentation: this.state.presentation,
              resetView: this.resetView,
              setCurrentSlide: this.setCurrentSlide,
              stepSlide: this.stepSlide,
              toggleAside: this.toggleAside,
              toggleInteractionMode: this.toggleInteractionMode,
              viewDifferentFromSlide: this.state.viewDifferentFromSlide });
        }
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
        newSlidePosition = this.state.navigation.position < this.state.presentation.order.length - 1 ? this.state.navigation.position + 1 : this.state.navigation.position; 
      } else {
        newSlidePosition = this.state.navigation.position > 0 ? this.state.navigation.position - 1 : this.state.navigation.position; 
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
      var _this4 = this;

      var template = this.props.template;

      var activeTemplate = this.state.presentation && this.state.presentation.settings && this.state.presentation.settings.template || template || 'stepper';
      var onWheel = function onWheel(e) {
        if (typeof _this4.props.onWheel === 'function') {
          _this4.props.onWheel(e);
        }
      };
      return _react2.default.createElement(
        'div',
        {
          onWheel: onWheel,
          className: 'quinoa-presentation-player ' + activeTemplate + ' ' + (this.props.className ? this.props.className : ''),
          style: this.props.style },
        this.renderComponent()
      );
    }
  }]);

  return QuinoaPresentationPlayer;
}(_react.Component);



QuinoaPresentationPlayer.propTypes = {
  presentation: _propTypes2.default.object.isRequired,
  beginAt: _propTypes2.default.number,
  options: _propTypes2.default.shape({
    allowViewExploration: _propTypes2.default.bool
  }),
  onSlideChange: _propTypes2.default.func,
  onExit: _propTypes2.default.func,
  onWheel: _propTypes2.default.func
};

exports.default = QuinoaPresentationPlayer;