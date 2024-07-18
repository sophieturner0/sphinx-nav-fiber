import styled from 'styled-components'
import EditNodeIcon from '~/components/Icons/EditNodeIcon'
import { imageUrlRegex } from '~/components/ModalsContainer/EditNodeNameModal/utils'
import { Flex } from '~/components/common/Flex'
import { Text } from '~/components/common/Text'
import { TextInput } from '~/components/common/TextInput'
import { TypeBadge } from '~/components/common/TypeBadge'
import { requiredRule } from '~/constants'
import { useFeatureFlagStore } from '~/stores/useFeatureFlagStore'
import { useSelectedNode } from '~/stores/useGraphStore'
import { useModal } from '~/stores/useModalStore'
import { colors } from '~/utils'

export const TitleEditor = () => {
  const { open: openAddItemNodeModal } = useModal('changeNodeType')
  const { close } = useModal('editNodeName')

  const { changeNodeTypeFeatureFlag } = useFeatureFlagStore((s) => ({
    changeNodeTypeFeatureFlag: s.changeNodeTypeFeatureFlag,
  }))

  const selectedNode = useSelectedNode()
  const nodeType = selectedNode?.node_type as string

  const handleEditNode = () => {
    close()
    openAddItemNodeModal()
  }

  return (
    <Flex>
      <Flex align="center" direction="row" justify="space-between" mb={18}>
        <Flex align="center" direction="row">
          <StyledText>Edit Node</StyledText>
          <LabelWrapper>
            <TypeBadge type={nodeType} />
            {changeNodeTypeFeatureFlag && (
              <EditIconWrapper onClick={handleEditNode}>
                <EditNodeIcon />
              </EditIconWrapper>
            )}
          </LabelWrapper>
        </Flex>
      </Flex>

      <Flex mb={18}>
        <LabelText
          style={{
            marginBottom: 8,
          }}
        >
          Node Name
        </LabelText>
        <TextInput
          id="cy-topic"
          maxLength={50}
          name="name"
          placeholder="Node name"
          rules={{
            ...requiredRule,
          }}
        />
      </Flex>

      <Flex mb={36}>
        <LabelText
          style={{
            marginBottom: 8,
          }}
        >
          image_url
        </LabelText>
        <TextInput
          id="cy-image_url"
          maxLength={500}
          name="image_url"
          placeholder="image_url"
          rules={{
            pattern: {
              message: 'Please enter a valid URL',
              value: imageUrlRegex,
            },
          }}
        />
      </Flex>
    </Flex>
  )
}

const StyledText = styled(Text)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`

const LabelText = styled(Text)`
  color: ${colors.GRAY6};
  font-family: 'Barlow';
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

const LabelWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 5px 0 0 40px;
`

const EditIconWrapper = styled(Flex)`
  align-items: center;
  cursor: pointer;
`
