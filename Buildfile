# ===========================================================================
# Project:   ThothApp
# ===========================================================================

config :thothsc, :required => [:sproutcore]
config :thoth_app, :required => [:sproutcore, "sproutcore/forms", "sproutcore/animation", "sproutcore/statechart", :sai, :'sai/canvas', :'sai/foundation', :thothsc]
