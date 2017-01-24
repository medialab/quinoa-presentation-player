'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _quinoaVisModules = require('quinoa-vis-modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PresentationLayout = function PresentationLayout(_ref) {
  var currentSlide = _ref.currentSlide,
      activeViewsParameters = _ref.activeViewsParameters,
      viewDifferentFromSlide = _ref.viewDifferentFromSlide,
      datasets = _ref.datasets,
      presentation = _ref.presentation,
      navigation = _ref.navigation,
      setCurrentSlide = _ref.setCurrentSlide,
      stepSlide = _ref.stepSlide,
      toggleAside = _ref.toggleAside,
      asideVisible = _ref.gui.asideVisible,
      _ref$options$allowVie = _ref.options.allowViewExploration,
      allowViewExploration = _ref$options$allowVie === undefined ? true : _ref$options$allowVie,
      onUserViewChange = _ref.onUserViewChange,
      resetView = _ref.resetView;

  var next = function next() {
    return !presentation.lastSlide && stepSlide(true);
  };
  var prev = function prev() {
    return !presentation.firstSlide && stepSlide(false);
  };
  return _react2.default.createElement(
    'div',
    { className: 'wrapper' },
    _react2.default.createElement(
      'aside',
      { className: asideVisible ? 'visible' : 'hidden' },
      _react2.default.createElement(
        'div',
        { className: 'metadata' },
        _react2.default.createElement(
          'h1',
          null,
          presentation.metadata.title || 'Quinoa'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'summary' },
        _react2.default.createElement(
          'ul',
          null,
          presentation.order.map(function (id, index) {
            var slide = presentation.slides[id];
            var onSlideClick = function onSlideClick() {
              return setCurrentSlide(id);
            };
            return _react2.default.createElement(
              'li',
              { onClick: onSlideClick, key: index, className: navigation.currentSlideId === id ? 'active' : 'inactive' },
              _react2.default.createElement(
                'h3',
                null,
                slide.title
              )
            );
          })
        )
      ),
      _react2.default.createElement('div', { onClick: toggleAside, className: 'aside-toggler' })
    ),
    currentSlide ? _react2.default.createElement(
      'figure',
      null,
      _react2.default.createElement(
        'div',
        { className: 'views-container' },
        Object.keys(presentation.visualizations).map(function (viewKey) {
          var visualization = presentation.visualizations[viewKey];
          var visType = visualization.metadata.visualizationType;
          var dataset = datasets[viewKey];
          var Component = _react2.default.createElement('span', null);
          switch (visType) {
            case 'timeline':
              Component = _quinoaVisModules.Timeline;
              break;
            case 'map':
              Component = _quinoaVisModules.Map;
              break;
            case 'network':
              Component = _quinoaVisModules.Network;
              break;
            default:
              break;
          }
          if (dataset) {
            var onViewChange = function onViewChange(e) {
              onUserViewChange(viewKey, e.viewParameters);
            };
            return _react2.default.createElement(
              'div',
              { className: 'view-container', id: viewKey, key: viewKey },
              _react2.default.createElement(
                'div',
                { className: 'view-header' },
                _react2.default.createElement(
                  'h3',
                  null,
                  visualization.metadata.title
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'view-body' },
                _react2.default.createElement(Component, {
                  data: dataset,
                  viewParameters: activeViewsParameters[viewKey].viewParameters,
                  allowUserViewChange: allowViewExploration,
                  onUserViewChange: onViewChange })
              )
            );
          }
        })
      ),
      _react2.default.createElement(
        'figcaption',
        { className: 'caption-container' },
        _react2.default.createElement(
          'div',
          { className: 'caption-header' },
          _react2.default.createElement(
            'button',
            { onClick: prev, className: presentation.firstSlide ? 'inactive' : '' },
            'Previous slide'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'caption-main' },
          _react2.default.createElement(
            'div',
            { className: 'caption-header' },
            _react2.default.createElement(
              'h2',
              null,
              presentation.slides[navigation.currentSlideId].title
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'caption-content' },
            _react2.default.createElement(_reactMarkdown2.default, { source: presentation.slides[navigation.currentSlideId].markdown })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'caption-footer' },
          viewDifferentFromSlide ? _react2.default.createElement(
            'button',
            { onClick: resetView },
            'Reset'
          ) : '',
          _react2.default.createElement(
            'button',
            { onClick: next, className: presentation.lastSlide ? 'inactive' : '' },
            'Next slide'
          )
        )
      )
    ) : '',
    _react2.default.createElement('div', { className: 'aside-bg' + (asideVisible ? ' active' : ' inactive'), onClick: toggleAside })
  );
};

exports.default = PresentationLayout;