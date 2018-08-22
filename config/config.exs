# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :negotiate,
  ecto_repos: [Negotiate.Repo]

# Configures the endpoint
config :negotiate, NegotiateWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "8E2VK/6/Nsq110GSFLKmin/psZdPxmuyVedJf4iWOv09E/tA412imQ+hcjHU47Nx",
  render_errors: [view: NegotiateWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Negotiate.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
