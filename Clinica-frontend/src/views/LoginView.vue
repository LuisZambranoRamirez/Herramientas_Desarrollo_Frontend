<template>
  <main class="login-page">
    <section class="login-container">

      <div class="login-brand">
        <div class="brand-logo">
          <span>S</span>
        </div>

        <h1>SoliDent</h1>
        <p>Excelencia en Salud Dental</p>
      </div>

      <div class="login-form">
        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus credenciales para acceder a la plataforma.</p>

        <form>
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="doctor@solident.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit">
            Iniciar Sesión
          </button>
        </form>
      </div>

    </section>
  </main>
</template>