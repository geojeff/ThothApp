# ===========================================================================
# Project:   ThothApp
# ===========================================================================

config :'Thoth-SC', :required => [:sproutcore]
config :scui, :required => [:sproutcore, :'scui/drawing', :'scui/linkit']

# SPECIAL FRAMEWORKS AND THEMES
# These do not require any of the built-in SproutCore frameworks
%w(testing debug sc_theme empty_theme).each do |target_name|
  config target_name,
    :required => [], :test_required => [], :debug_required => []
end

# CONFIGURE THEMES
config :sc_theme,
  :theme_name => 'sc-theme',
  :test_required  => ['sproutcore/testing'],
  :debug_required => ['sproutcore/debug']

config :thoth_app, :required => [:sproutcore, "sproutcore/forms", "sproutcore/animation", "sproutcore/statechart", :scui, :'Thoth-SC'], :theme => :sc_theme
