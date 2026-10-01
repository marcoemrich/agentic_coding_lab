//! Base premium for a group of alike components.
//!
//! "Alike" means the very same component type: 3 runes form a block, but
//! 2 runes plus a moonstone do not.

const PER_COMPONENT: u64 = 25;
const BLOCK_SIZE: u64 = 3;
const BLOCK_PREMIUM: u64 = 60;

/// Base premium in G for `count` components that are all of the same type.
/// The block rate is offered for a group of exactly three.
pub fn component_group_premium(count: u64) -> u64 {
    if count == BLOCK_SIZE {
        BLOCK_PREMIUM
    } else {
        count * PER_COMPONENT
    }
}
