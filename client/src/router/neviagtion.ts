import router from '@/router'

export const navigateToLogin = (): void => {
    router.push("/");
}

export const navigateToLobby = (): void => {
    router.push("/lobby");
}

export const navigateToRoom = (id: string): void => {
    router.push(`/room/${id}`);
}
