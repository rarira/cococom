//TODO: https://github.com/expo/expo/tree/sdk-51/packages/expo-notifications#requestpermissionsasyncrequest-notificationpermissionsrequest-promisenotificationpermissionsstatus
// export function useGetNotificationPermission() {
//   const [permission, setPermission] = useState<PermissionStatus | null>(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Notifications.getPermissionsAsync();
//       setPermission(status);
//     })();
//   }, []);

//   return permission;
// }
