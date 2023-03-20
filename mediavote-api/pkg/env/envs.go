package env

import (
	"os"
	"sync"

	"github.com/rs/zerolog/log"
)

func Port() string        { return Get("PORT") }
func Environment() string { return Get("ENV") }
func IsProd() bool        { return Get("ENV") == EnvProd }

const (
	EnvProd = "production"
	EnvTest = "testing"
	EnvDev  = "dev"
)

const envPrefix = "MEDIAVOTE_"

var envs = struct {
	lock  sync.Mutex
	store map[string]any
}{store: map[string]any{}}

func getOnce[T any](name string, g func() T) T {
	envs.lock.Lock()
	defer envs.lock.Unlock()
	exist, ok := envs.store[name]
	if ok {
		return exist.(T)
	}
	value := g()
	envs.store[name] = value
	return value
}

func Get(name string) string {
	return getOnce(name, func() string {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			log.Fatal().Msgf("required env '%s', missed", name)
		}
		return e
	})
}

func GetOr(name string, fallback string) string {
	return getOnce(name, func() string {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			return fallback
		}
		return e
	})
}

func GetMapOr[T any](name string, fallback T, f func(string) (T, error)) T {
	return getOnce(name, func() T {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			return fallback
		}
		t, err := f(e)
		if err != nil {
			log.Fatal().Msgf("invalid env '%s'", name)
		}
		return t
	})
}
