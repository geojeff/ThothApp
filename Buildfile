# ===========================================================================
# Project:   ThothApp
# ===========================================================================

config :'Thoth-SC', :required => [:sproutcore]
config :thoth_app, :required => [:sproutcore, "sproutcore/forms", "sproutcore/animation", "sproutcore/statechart", :Sai, :'Sai/canvas', :'Sai/foundation', :'Thoth-SC']
