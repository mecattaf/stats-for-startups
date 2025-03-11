'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'

/**
 * Math component for rendering LaTeX equations
 * 
 * @param {Object} props - Component props
 * @param {string} props.math - The LaTeX equation to render
 * @param {boolean} props.block - If true, renders as a block equation (centered with larger font), otherwise inline
 * @param {Object} props.options - Additional KaTeX options
 */
export default function Math({ math, block = false, options = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, {
        throwOnError: false,
        displayMode: block,
        ...options
      })
    }
  }, [math, block, options])

  return <span ref={ref} className={block ? 'my-4 block text-center' : 'mx-1'} />
}

/**
 * InlineMath component for rendering inline LaTeX equations
 */
export function InlineMath({ children, ...props }) {
  return <Math math={children} block={false} {...props} />
}

/**
 * BlockMath component for rendering block LaTeX equations
 */
export function BlockMath({ children, ...props }) {
  return <Math math={children} block={true} {...props} />
}
