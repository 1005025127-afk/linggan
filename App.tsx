import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

type ScreenKey = 'workspace' | 'upload' | 'detail' | 'library' | 'search';

type PickedFile = {
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
};

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  tone?: 'plain' | 'tinted';
  style?: object;
};

const navItems: { key: ScreenKey; label: string }[] = [
  { key: 'workspace', label: '工作台' },
  { key: 'upload', label: '上传' },
  { key: 'detail', label: '详情' },
  { key: 'library', label: '知识库1' },
  { key: 'search', label: '检索' },
];

const defaultMaterials = [
  {
    title: '《平台责任边界的规范重构》',
    note: '可用于理论基础章节，与既有 3 篇材料形成支持关系。',
  },
  {
    title: '指导案例：平台推荐责任争议',
    note: '争议焦点集中在注意义务程度，可与上位论文做对照。',
  },
];

const conceptTags = ['平台责任', '注意义务', '算法分发'];

function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{title}</Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

function SectionCard({ title, children, tone = 'plain', style }: SectionCardProps) {
  return (
    <View style={[styles.card, tone === 'tinted' ? styles.cardTinted : styles.cardPlain, style]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  tone = 'dark',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  tone?: 'dark' | 'light';
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        tone === 'dark' ? styles.buttonDark : styles.buttonLight,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={[styles.buttonText, tone === 'dark' ? styles.buttonTextDark : styles.buttonTextLight]}>
        {label}
      </Text>
    </Pressable>
  );
}

function WorkspaceScreen({
  onOpenUpload,
  onOpenSearch,
  onOpenDetail,
  materialTitle,
  totalMaterials,
  savedCount,
}: {
  onOpenUpload: () => void;
  onOpenSearch: () => void;
  onOpenDetail: () => void;
  materialTitle: string;
  totalMaterials: number;
  savedCount: number;
}) {
  return (
    <AppShell title="Research Workspace" subtitle="平台责任边界 / 研究进行中">
      <View style={styles.contentPad}>
        <SectionCard title="研究画像">
          <View style={styles.heroFocusBlock}>
            <Text style={styles.heroFocusTitle}>平台责任边界</Text>
            <Text style={styles.bodyText}>关键词：平台责任 / 注意义务 / 算法分发</Text>
            <View style={styles.smallPill}>
              <Text style={styles.smallPillText}>当前重点专题</Text>
            </View>
          </View>
          <View style={styles.metricRow}>
            <View style={styles.metricCardMuted}>
              <Text style={styles.metricNumber}>{totalMaterials}</Text>
              <Text style={styles.metricLabel}>已读材料</Text>
            </View>
            <View style={styles.metricCardPlain}>
              <Text style={styles.metricNumber}>{savedCount}</Text>
              <Text style={styles.metricLabel}>已入知识库</Text>
            </View>
          </View>
        </SectionCard>

        <View style={styles.rowGap}>
          <Pressable style={styles.flexFill} onPress={onOpenUpload}>
            <SectionCard title="上传材料" tone="tinted" style={styles.pressableCard}>
              <Text style={styles.bodyTextStrong}>上传文献 / 案例 / 指导性案例</Text>
              <Text style={styles.bodyText}>点这里直接选择 PDF 文件。</Text>
            </SectionCard>
          </Pressable>
          <Pressable style={styles.flexFill} onPress={onOpenSearch}>
            <SectionCard title="语义检索" style={styles.pressableCard}>
              <Text style={styles.bodyTextStrong}>找回已读材料里的观点与依据</Text>
              <Text style={styles.bodyText}>点这里进入检索页。</Text>
            </SectionCard>
          </Pressable>
        </View>

        <Pressable onPress={onOpenDetail}>
          <SectionCard title="最新速读卡" tone="tinted" style={styles.pressableCard}>
            <Text style={styles.materialTitle}>{materialTitle}</Text>
            <Text style={styles.bodyText}>核心论点：平台内容推荐中承担更高注意义务。</Text>
            <Text style={styles.subtleLink}>点击查看详情</Text>
          </SectionCard>
        </Pressable>

        <SectionCard title="研究相关性">
          <Text style={styles.bodyText}>
            适合进入第二章理论基础部分，可作为注意义务扩张路径的支持材料。
          </Text>
        </SectionCard>

        <SectionCard title="最近材料">
          {defaultMaterials.map((item) => (
            <View key={item.title} style={styles.materialItem}>
              <Text style={styles.materialTitle}>{item.title}</Text>
              <Text style={styles.materialNote}>{item.note}</Text>
            </View>
          ))}
        </SectionCard>
      </View>
    </AppShell>
  );
}

function UploadScreen({
  selectedFile,
  generated,
  onPickFile,
  onGenerate,
  onGoDetail,
}: {
  selectedFile: PickedFile | null;
  generated: boolean;
  onPickFile: () => void;
  onGenerate: () => void;
  onGoDetail: () => void;
}) {
  return (
    <AppShell title="Upload Materials" subtitle="上传文献、案例与研究材料">
      <View style={styles.contentPad}>
        <View style={styles.uploadDropZone}>
          <Text style={styles.dropTitle}>选择并上传 PDF</Text>
          <Text style={styles.dropSubtitle}>支持学术文献、裁判文书、指导性案例</Text>
          <ActionButton label="选择文件" onPress={onPickFile} />
        </View>

        {selectedFile ? (
          <SectionCard title="当前已选择文件">
            <Text style={styles.materialTitle}>{selectedFile.name}</Text>
            <Text style={styles.bodyText}>格式：{selectedFile.mimeType || '未知类型'}</Text>
            <Text style={styles.bodyText}>大小：{selectedFile.size ? `${Math.round(selectedFile.size / 1024)} KB` : '未知'}</Text>
            <View style={styles.buttonRow}>
              <ActionButton label="生成速读卡" onPress={onGenerate} />
              {generated ? <ActionButton label="查看详情" onPress={onGoDetail} tone="light" /> : null}
            </View>
          </SectionCard>
        ) : null}

        <SectionCard title="上传后你会得到">
          <Text style={styles.bodyText}>1. 文献 / 案例速读卡</Text>
          <Text style={styles.bodyText}>2. 研究相关性判断</Text>
          <Text style={styles.bodyText}>3. 自动进入个人知识库</Text>
        </SectionCard>

        <SectionCard title="推荐格式" tone="tinted">
          <View style={styles.tagWrap}>
            <View style={styles.tagChip}><Text style={styles.tagText}>PDF 文献</Text></View>
            <View style={styles.tagChip}><Text style={styles.tagText}>裁判文书</Text></View>
            <View style={styles.tagChip}><Text style={styles.tagText}>指导案例</Text></View>
          </View>
        </SectionCard>
      </View>
    </AppShell>
  );
}

function DetailScreen({
  materialTitle,
  generated,
  saved,
  onSave,
}: {
  materialTitle: string;
  generated: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <AppShell title="Reading Detail" subtitle="文献速读卡与研究相关性详情">
      <View style={styles.contentPad}>
        <SectionCard title={materialTitle}>
          <Text style={styles.bodyText}>
            {generated
              ? '已根据你上传的材料生成速读结果。核心论点、争议焦点和研究用途建议都已经整理好。'
              : '这里会展示你最近一篇材料的速读结果。'}
          </Text>
        </SectionCard>

        <View style={styles.rowGap}>
          <SectionCard title="速读卡" tone="tinted" style={styles.flexFill}>
            <Text style={styles.bodyText}>核心论点、争议焦点、裁判逻辑、可引用片段已自动整理。</Text>
          </SectionCard>
          <SectionCard title="研究相关性" style={styles.flexFill}>
            <Text style={styles.bodyText}>
              适合进入论文第二章理论基础部分，可与 3 篇既有材料形成支持关系。
            </Text>
          </SectionCard>
        </View>

        <SectionCard title="可引用片段">
          <Text style={styles.quoteText}>
            “平台在算法推荐中的注意义务，并不因其技术中立性主张而当然减轻。”
          </Text>
        </SectionCard>

        <SectionCard title="研究用途建议" tone="tinted">
          <Text style={styles.bodyText}>
            可作为理论基础章节的支持材料，也适合与反面观点材料一起放入综述整理。
          </Text>
          <View style={styles.buttonRow}>
            <ActionButton
              label={saved ? '已加入知识库' : '加入知识库'}
              onPress={onSave}
              disabled={saved}
            />
          </View>
        </SectionCard>
      </View>
    </AppShell>
  );
}

function LibraryScreen({ saved, uploadedTitle }: { saved: boolean; uploadedTitle: string }) {
  const list = saved
    ? [
        `${uploadedTitle} · 已加入知识库`,
        '指导案例：平台推荐责任争议 · 已连接到专题',
        '《注意义务扩张路径研究》 · 可进入综述',
      ]
    : [
        '《平台责任边界的规范重构》 · 高相关',
        '指导案例：平台推荐责任争议 · 已连接到专题',
        '《注意义务扩张路径研究》 · 可进入综述',
      ];

  return (
    <AppShell title="Knowledge Library" subtitle="个人知识库与双向连接">
      <View style={styles.contentPad}>
        <SectionCard title="专题与标签">
          <View style={styles.tagChipMuted}><Text style={styles.tagTextMuted}>平台责任边界</Text></View>
          <View style={styles.tagChipPlain}><Text style={styles.tagText}>注意义务</Text></View>
        </SectionCard>

        <View style={styles.rowGap}>
          <SectionCard title="48 篇已读材料" tone="tinted" style={styles.flexFill}>
            <Text style={styles.bodyText}>文献、案例、法规解释持续沉淀。</Text>
          </SectionCard>
          <SectionCard title="概念与案例已连接成网" style={styles.flexFill}>
            <Text style={styles.bodyText}>后续检索时不仅能找回材料，还能找回它们之间的关系。</Text>
          </SectionCard>
        </View>

        <SectionCard title="最近加入知识库">
          {list.map((item) => (
            <Text key={item} style={styles.bodyText}>
              {item}
            </Text>
          ))}
        </SectionCard>

        <View style={styles.rowGap}>
          {conceptTags.map((tag, index) => (
            <View
              key={tag}
              style={[styles.graphNode, index === 1 ? styles.graphNodePlain : styles.graphNodeTinted]}
            >
              <Text style={styles.graphNodeText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </AppShell>
  );
}

function SearchScreen({
  query,
  onChangeQuery,
  onRunSearch,
}: {
  query: string;
  onChangeQuery: (value: string) => void;
  onRunSearch: () => void;
}) {
  return (
    <AppShell title="Semantic Search" subtitle="问我读过的材料里哪些讨论了某个问题">
      <View style={styles.contentPad}>
        <SectionCard title="输入问题">
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={onChangeQuery}
            placeholder="输入研究问题"
            placeholderTextColor="#98a3a9"
          />
          <ActionButton label="开始检索" onPress={onRunSearch} />
        </SectionCard>

        <SectionCard title="相关材料">
          <Text style={styles.bodyText}>《平台责任边界的规范重构》</Text>
          <Text style={styles.bodyText}>指导案例：平台推荐责任争议</Text>
          <Text style={styles.bodyText}>《注意义务扩张路径研究》</Text>
        </SectionCard>

        <SectionCard title="命中依据" tone="tinted">
          <Text style={styles.bodyText}>问题：{query}</Text>
          <Text style={styles.bodyText}>争议焦点：平台在推荐链条中的审查义务与责任边界。</Text>
          <Text style={styles.subtleLink}>可继续查看关联内容。</Text>
          <View style={styles.tagWrap}>
            <View style={styles.tagChipMuted}><Text style={styles.tagTextMuted}>平台责任</Text></View>
            <View style={styles.tagChipPlain}><Text style={styles.tagText}>注意义务</Text></View>
          </View>
        </SectionCard>
      </View>
    </AppShell>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('workspace');
  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null);
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('我读过的材料里，哪些讨论了平台责任边界？');

  const uploadedTitle = selectedFile?.name || '《平台责任边界的规范重构》';

  const totalMaterials = useMemo(() => (selectedFile ? 49 : 48), [selectedFile]);
  const savedCount = useMemo(() => (saved ? 13 : 12), [saved]);

  async function handlePickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf'],
      multiple: false,
      copyToCacheDirectory: false,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    setSelectedFile({
      name: asset.name,
      size: asset.size,
      uri: asset.uri,
      mimeType: asset.mimeType,
    });
    setGenerated(false);
    setSaved(false);
  }

  function handleGenerate() {
    if (!selectedFile) return;
    setGenerated(true);
    setActiveScreen('detail');
  }

  function handleSaveToLibrary() {
    setSaved(true);
    setActiveScreen('library');
  }

  const currentScreen = useMemo(() => {
    switch (activeScreen) {
      case 'upload':
        return (
          <UploadScreen
            selectedFile={selectedFile}
            generated={generated}
            onPickFile={handlePickFile}
            onGenerate={handleGenerate}
            onGoDetail={() => setActiveScreen('detail')}
          />
        );
      case 'detail':
        return (
          <DetailScreen
            materialTitle={uploadedTitle}
            generated={generated}
            saved={saved}
            onSave={handleSaveToLibrary}
          />
        );
      case 'library':
        return <LibraryScreen saved={saved} uploadedTitle={uploadedTitle} />;
      case 'search':
        return (
          <SearchScreen
            query={query}
            onChangeQuery={setQuery}
            onRunSearch={() => setActiveScreen('search')}
          />
        );
      case 'workspace':
      default:
        return (
          <WorkspaceScreen
            onOpenUpload={() => setActiveScreen('upload')}
            onOpenSearch={() => setActiveScreen('search')}
            onOpenDetail={() => setActiveScreen('detail')}
            materialTitle={uploadedTitle}
            totalMaterials={totalMaterials}
            savedCount={savedCount}
          />
        );
    }
  }, [activeScreen, generated, query, saved, selectedFile, totalMaterials, savedCount, uploadedTitle]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {currentScreen}
      <View style={styles.bottomNavWrap}>
        <View style={styles.bottomNav}>
          {navItems.map((item) => {
            const active = item.key === activeScreen;
            return (
              <Pressable
                key={item.key}
                onPress={() => setActiveScreen(item.key)}
                style={[styles.navButton, active && styles.navButtonActive]}
              >
                <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const palette = {
  page: '#f7f6f1',
  softBlue: '#edf5f6',
  softBlueStrong: '#d8eaed',
  surface: '#fffefb',
  text: '#223038',
  body: '#66757d',
  border: '#dfe7e9',
  deep: '#1f2328',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.page,
  },
  screenContent: {
    paddingBottom: 120,
    gap: 18,
  },
  pageHeader: {
    backgroundColor: palette.softBlue,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 6,
  },
  pageTitle: {
    color: palette.text,
    fontSize: 32,
    lineHeight: 36,
    fontFamily: 'Georgia',
  },
  pageSubtitle: {
    color: '#78858c',
    fontSize: 12,
  },
  contentPad: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 14,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  cardPlain: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardTinted: {
    backgroundColor: palette.softBlueStrong,
  },
  pressableCard: {
    minHeight: 120,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  heroFocusBlock: {
    backgroundColor: palette.softBlue,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  heroFocusTitle: {
    color: palette.text,
    fontSize: 22,
    fontFamily: 'Georgia',
  },
  bodyText: {
    color: palette.body,
    fontSize: 13,
    lineHeight: 20,
  },
  bodyTextStrong: {
    color: '#42535b',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  smallPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#d7e1e4',
  },
  smallPillText: {
    color: '#4d6168',
    fontSize: 12,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCardMuted: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: palette.softBlue,
    padding: 14,
    gap: 4,
  },
  metricCardPlain: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: palette.page,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    gap: 4,
  },
  metricNumber: {
    color: palette.text,
    fontSize: 28,
    fontFamily: 'Georgia',
  },
  metricLabel: {
    color: palette.body,
    fontSize: 12,
  },
  materialItem: {
    gap: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f2',
  },
  materialTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  materialNote: {
    color: palette.body,
    fontSize: 12,
    lineHeight: 18,
  },
  searchPromptBox: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchPromptText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 20,
  },
  searchHint: {
    color: '#4b5d65',
    fontSize: 12,
    lineHeight: 18,
  },
  subtleLink: {
    color: '#67757d',
    fontSize: 12,
  },
  uploadDropZone: {
    minHeight: 260,
    borderRadius: 28,
    backgroundColor: palette.softBlue,
    borderWidth: 1,
    borderColor: '#d5e3e6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 10,
  },
  dropTitle: {
    color: palette.text,
    fontSize: 30,
    fontFamily: 'Georgia',
  },
  dropSubtitle: {
    color: palette.body,
    fontSize: 13,
    textAlign: 'center',
  },
  rowGap: {
    flexDirection: 'row',
    gap: 14,
  },
  flexFill: {
    flex: 1,
  },
  quoteText: {
    color: '#4b5c64',
    fontSize: 14,
    lineHeight: 23,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: '#d9e2e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagChipMuted: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: palette.softBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagChipPlain: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    color: '#5a6970',
    fontSize: 12,
    fontWeight: '600',
  },
  tagTextMuted: {
    color: '#496169',
    fontSize: 12,
    fontWeight: '600',
  },
  graphNode: {
    flex: 1,
    minHeight: 116,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphNodeTinted: {
    backgroundColor: palette.softBlue,
  },
  graphNodePlain: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  graphNodeText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  innerCard: {
    padding: 14,
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: palette.deep,
  },
  buttonLight: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: '#ffffff',
  },
  buttonTextLight: {
    color: palette.text,
  },
  searchInput: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    fontSize: 14,
  },
  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,254,251,0.94)',
    borderWidth: 1,
    borderColor: '#dfe7e9',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '92%',
  },
  navButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: palette.deep,
  },
  navButtonText: {
    color: '#68767d',
    fontSize: 12,
    fontWeight: '600',
  },
  navButtonTextActive: {
    color: '#ffffff',
  },
});
