# ===========================================================================
# Project:   ThothApp
# ===========================================================================

config :Thoth-SC, :required => [:sproutcore]
config :thoth_app, :required => [:sproutcore, "sproutcore/forms", "sproutcore/animation", "sproutcore/statechart", :sai, :'sai/canvas', :'sai/foundation', :Thoth-SC]
