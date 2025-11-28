import { auth } from '@/auth'
import { getUrl } from '@/lib/get-url'

export default auth(async (req) => {
  const isLoggedIn = !!req.auth
  // const permissions = req.auth?.user?.permissions // <--- Comentamos isso por enquanto
  const pathname = req.nextUrl.pathname

  // Se já estiver logado e tentar ir pro login, manda pra home
  if (isLoggedIn && pathname === '/auth/sign-in') {
    return Response.redirect(new URL(getUrl('/')))
  }

  // --- ALTERAÇÃO AQUI ---
  // Antes verificava (!permissions?.includes('admin')).
  // Agora verificamos apenas (!isLoggedIn).
  // Se NÃO estiver logado e tentar entrar no admin, manda pro login.
  if (!isLoggedIn && pathname.startsWith('/admin')) {
    return Response.redirect(new URL(getUrl('/auth/sign-in')))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}