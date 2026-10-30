import { api } from './config'

export const changePassword = (old_password, new_password) =>
  api('/conta/alterar-senha/', {
    method: 'POST',
    data: { old_password, new_password },
  })

export const deleteAccount = (password) =>
  api('/conta/excluir/', { method: 'POST', data: { password } })
