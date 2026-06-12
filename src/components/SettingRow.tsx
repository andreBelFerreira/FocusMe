import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "../store/useThemeStore";

interface BaseProps {
  icon: string;
  label: string;
  border?: boolean;
}

interface ToggleProps extends BaseProps {
  type: "toggle";
  value: boolean;
  onToggle: (v: boolean) => void;
}

interface PressProps extends BaseProps {
  type: "press";
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

interface ColorProps extends BaseProps {
  type: "color";
  color: string;
  onPress: () => void;
}

type Props = ToggleProps | PressProps | ColorProps;

export function SettingRow(props: Props) {
  const { theme } = useThemeStore();
  const { icon, label, border = true } = props;

  const right = () => {
    if (props.type === "toggle") {
      return (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
          thumbColor="#ffffff"
        />
      );
    }
    if (props.type === "color") {
      return (
        <TouchableOpacity onPress={props.onPress}>
          <View style={[styles.colorDot, { backgroundColor: props.color }]} />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.valueRow}>
        {props.value ? <Text style={[styles.valueText, { color: theme.textMuted }]}>{props.value}</Text> : null}
        <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
      </View>
    );
  };

  const content = (
    <View style={[
      styles.row,
      { borderBottomColor: theme.border },
      border && styles.rowBorder,
    ]}>
      <View style={styles.left}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[
          styles.label,
          { color: theme.text },
          props.type === "press" && props.danger && styles.labelDanger,
        ]}>
          {label}
        </Text>
      </View>
      {right()}
    </View>
  );

  if (props.type === "press") {
    return (
      <TouchableOpacity onPress={props.onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 13 },
  rowBorder:   { borderBottomWidth: 0.5 },
  left:        { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  icon:        { fontSize: 18, width: 24, textAlign: "center" },
  label:       { fontSize: 14 },
  labelDanger: { color: "#ef4444" },
  valueRow:    { flexDirection: "row", alignItems: "center", gap: 4 },
  valueText:   { fontSize: 13 },
  arrow:       { fontSize: 18, lineHeight: 22 },
  colorDot:    { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#e5e7eb" },
});