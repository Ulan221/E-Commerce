import { StyleSheet, TextInput, View, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
    value: string;
    onChange: (text: string) => void;
    onClear: () => void;
}

export default function SearchInput({ value, onChange, onClear }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#808080" />
            <TextInput
                style={styles.input}
                placeholder="Search Product..."
                placeholderTextColor="#808080"
                value={value}
                onChangeText={onChange}
            />
            {value.length > 0 && (
                <Pressable onPress={onClear}>
                    <Ionicons name="close-circle" size={20} color="#808080" />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 28,
        paddingHorizontal: 20,
        margin: 16,
        backgroundColor: '#242424',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#FFFFFF',
    },
});
