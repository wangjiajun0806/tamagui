import { getDocLayout } from '@components/layouts/DocLayout'
import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { H1, Spacer } from 'tamagui'

import { DocsPage } from '../../../components/DocsPage'
import { HomeH1 } from '../../../components/HomeH2'
import { SubTitle, nbspLastWord } from '../../../components/SubTitle'
import { TamaguiExamples } from '../../../components/TamaguiExamplesCode'
import type { Frontmatter } from '../../../frontmatter'
import { getCompilationExamples } from '../../../lib/getCompilationExamples'

type Doc = {
  frontmatter: Frontmatter
  code: any
  examples: any
}

export default function DocIntroPage({ frontmatter, code, examples }: Doc) {
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <TamaguiExamples.Provider value={examples}>
      <TitleAndMetaTags title={`${frontmatter.title} — Tamagui`} />
      <HomeH1>{nbspLastWord(frontmatter.title)}</HomeH1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <ThemeTint>
        <Component components={components as any} />
      </ThemeTint>
      <QuickNav key={frontmatter.slug} />
    </TamaguiExamples.Provider>
  )
}

DocIntroPage.getLayout = getDocLayout

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/intro')
  const paths = frontmatters.map(({ slug }) => ({
    params: { slug: slug.replace('docs/intro/', '') },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs/intro', context.params.slug)
  return {
    props: {
      frontmatter,
      code,
      examples: getCompilationExamples(),
    },
  }
}
