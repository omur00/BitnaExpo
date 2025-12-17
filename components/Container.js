import { View } from 'react-native';

const styles = {
  container: 'flex flex-1 m-6',
};

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <View className={styles.container}>{children}</View>;
};
