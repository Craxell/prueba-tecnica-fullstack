import { Button, Modal } from '../../../components/common'

type Target = { id: string; name: string }

type Props = {
  target: Target | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function RemoveFavoriteModal({
  target,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={!!target}
      onClose={() => !loading && onClose()}
      title="Quitar de favoritos"
      footer={
        <>
          <Button variant="ghost" disabled={loading} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" disabled={loading} onClick={onConfirm}>
            {loading ? 'Quitando…' : 'Sí, quitar de favoritos'}
          </Button>
        </>
      }
    >
      {target ? (
        <p className="text-left text-sm text-[var(--text)]">
          ¿Quitar a{' '}
          <strong className="capitalize text-[var(--text-h)]">
            {target.name}
          </strong>{' '}
          de tus favoritos? Solo deja de aparecer en tu lista.
        </p>
      ) : null}
    </Modal>
  )
}
